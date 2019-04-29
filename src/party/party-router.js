<<<<<<< HEAD
const express = require('express');
const path = require('path');
const PartyService = require('./party-service');
const PartyRouter = express.Router();
const SpotService = require('../spots/spot-service');
const ReqService = require('../requirements/req-service');
const {requireAuth} = require('../middleware/jwt-auth');
const bodyParser = express.json();

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
      //grab the party details
      const createdParty = await PartyService.serializeParty(db, await PartyService.getPartyById(db, partyId));
      //emit the party details to everyone in the room, including the sender
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${party.id}`))
        .json(createdParty);

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
  .route('/:partyId')
  .get(async (req, res, next) => {
    const { partyId } = req.params;
    try {
      let party = await PartyService.getPartyById(
        req.app.get('db'),
        partyId
      );
      res.json(await PartyService.serializeParty(req.app.get('db'), party));
      next();
    } catch(error) {
      next(error);
    }
  });
=======
const express = require("express");
const PartyService = require("./party-service");
const PartyRouter = express.Router();
const REQUIREMENT_STORE = require("../store/requirements");
const ROLES_STORE = require("../store/roles");

PartyRouter.get("/:partyId", async (req, res, next) => {
  const { partyId } = req.params;
  try {
    let party = await PartyService.getPartyById(req.app.get("db"), partyId);
    const [partyResponse] = await PartyService.serializeParty(
      req.app.get("db"),
      party
    );
>>>>>>> 619280e84995c325653b4be0824d008dd5a7d9b3

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

module.exports = PartyRouter;
