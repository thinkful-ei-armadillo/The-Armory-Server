const express = require('express');
const PartyService = require('../party/party-service');
const SpotService = require('../spots/spot-service');
const {requireAuth} = require('../middleware/jwt-auth');
const bodyParser = express.json();
const SpotRouter = express.Router();

const ioService = require('../io-service');

SpotRouter
  .patch("/:spotId", requireAuth, bodyParser, async (req, res, next) => {
    const { spotId } = req.params;
    const { game_id, party_id } = req.body;

    const db = req.app.get('db');
    try {
      const spot = await SpotService.getSpotById(db, spotId);

      if (!spot) {
        return res.status(404).json({ error: 'Spot not found' });
      }

      if (spot.filled) {
        return res.json({ error: 'Spot is already taken' });
      }

      const [{count}] = await SpotService.getSpotsLeft(db, party_id);
 
      const promises = [await SpotService.updateSpot(db, spotId, { filled: req.user.id })];

      if (count < 2) {
        promises.push(await PartyService.updateParty(db, party_id, { ready: false }));
      }

      await Promise.all(promises);
      
      const updatedParty = await PartyService.serializeGamePageParty(db, await PartyService.getPartyById(db, party_id));

      res.sendStatus(204);
      ioService.emitRoomEvent(count < 2 ? 'delist party' : 'spot updated', `/games/${game_id}`, updatedParty);
      ioService.emitRoomEvent('update party', `/party/${party_id}`);
      next();
    } catch (error) {
      next(error);
    }
  });
  
module.exports = SpotRouter;
