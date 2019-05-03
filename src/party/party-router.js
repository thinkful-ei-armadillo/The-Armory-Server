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
      //Verify information here
      if (!party.game_id || !party.title) {
        return res.json({ error: 'Missing required party information' });
      }
      if (spots.length < 1) {
        return res.json({ error: 'Must have at least one additional spot available' });
      }

      //inserts the party and grabs the ID
      partyId = await PartyService.insertParty(db, party);
      //updates all spots and the roles associated with said spot, inserts party requirements
      await Promise.all([
        await SpotService.insertSpot(db, partyId, [], req.user.id), 
        await ReqService.insertReq(db, partyId, requirement),
        ...spots.map(async(spot) => {
          return await SpotService.insertSpot(db, partyId, spot.roles, spot.filled)
        })
      ]);
      //now that all requirements and spots are inserted, update DB so it knows party is publicly ready
      await PartyService.setReady(db, partyId);
      //emit a message telling clients to re-request their data
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${partyId}`))
        .json({ id: partyId });

      ioService.emitRoomEvent('update parties', room_id);
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
      let party = await PartyService.getPartyById(req.app.get("db"), partyId);
      const [partyResponse] = await PartyService.serializeParty(
        req.app.get("db"),
        party
      );
  
      partyResponse.reqs = partyResponse.reqs.map(req => {
        return {
          req_name: REQUIREMENT_STORE[partyResponse.game_id][req.id]
        };
      });
      partyResponse.spots = partyResponse.spots.map(spot => {
        return {
          ...spot,
          roles: spot.roles.map(role => {
            return {
              role_name: ROLES_STORE[partyResponse.game_id][role.id] || null
            };
          })
        };
      });
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
