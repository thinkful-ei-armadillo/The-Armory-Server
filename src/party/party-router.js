const express = require('express');
const path = require('path');
const PartyService = require('./party-service');
const PartyRouter = express.Router();
const SpotService = require('../spots/spot-service');
const ReqService = require('../requirements/req-service');
const {requireAuth} = require('../middleware/jwt-auth');
const bodyParser = express.json();

const REQUIREMENT_STORE = require('../store/requirements');
const ROLES_STORE = require('../store/roles');

const ioService = require('../io-service');

PartyRouter
  .post('/', requireAuth, bodyParser, async (req,res,next) => {
    let partyId;
    const db = req.app.get('db');
    try {
      const { party, spots, requirement, room_id } = req.body;
      party.owner_id = req.user.id;
      //party checks
      if (!party.game_id || !party.title || !(party.gamemode || party.gamemode === 0)) {
        return res.status(400).json({ error: 'Missing required party information' });
      }

      //spot checks
      if (spots.length < 1) {
        return res.status(400).json({ error: 'Must have at least one additional spot available' });
      }

      //requirement checks:
      if (requirement.length > 2) {
        return res.status(400).json({ error: 'Can only have 2 requirements maximum per party' });
      }
      if (requirement.length === 2 && requirement[0] === requirement[1]) {
        return res.status(400).json({ error: 'Cannot have duplicate requirements' });
      }

      const userParty = await SpotService.getSpotByUserId(db, req.user.id);
      if (userParty) {
        return res.status(400).json({ error: 'Cannot be in multiple parties' })
      }

      //inserts the party and grabs the ID
      partyId = await PartyService.insertParty(db, party);
      //updates all spots and the roles associated with said spot, inserts party requirements
      await Promise.all([
        //Owner spot always exists
        await SpotService.insertSpot(db, partyId, [], req.user.id), 
        //requirements
        ...requirement.map(async(reqs) => {
          return await ReqService.insertReq(db, partyId, reqs)
        }),
        //additional spots and their roles
        ...spots.map(async(spot) => {
          return await SpotService.insertSpot(db, partyId, spot.roles, spot.filled)
        })
      ]);
      //now that all requirements and spots are inserted, update DB so it knows party is publicly ready
      await PartyService.setReady(db, partyId);
      //grab the party details
      const createdParty = await PartyService.serializeGamePageParty(db, await PartyService.getPartyById(db, partyId));
      //emit the party details to everyone in the room, including the sender
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${partyId}`))
        .json(partyId);

      ioService.emitRoomEvent('posted party', room_id, createdParty);
      next();
      
    } catch(err) {
      //if there was an error but SOME of the stuff was inserted, need to delete to prevent it staying forever, deleting party cascades
      if (partyId) {
        await PartyService.deleteParty(db, partyId);
      }
      console.error(err);
      next(err);
    }
  });

PartyRouter
  .get("/:partyId", async (req, res, next) => {
    const { partyId } = req.params;
    try {
      let partyResponse = await PartyService.getPartyById(
        req.app.get('db'),
        partyId
      );

      if (partyResponse.length < 1) {
        return res.status(404).json({ error: 'Party not found' });
      }

      partyResponse = await PartyService.serializeParty(req.app.get('db'), partyResponse);

      res.json(partyResponse);
      next();
    } catch (error) {
      next(error);
    }
  });

PartyRouter
  .route('/messages/:partyId')
  .get(async (req, res, next) => {
    const { partyId } = req.params;
    try {
      const chatLog = await PartyService.getPartyMessages(req.app.get('db'), partyId);
      res.status(200).json(chatLog);
    }
    catch (error){
      next(error);
    }
  })

module.exports = PartyRouter;
