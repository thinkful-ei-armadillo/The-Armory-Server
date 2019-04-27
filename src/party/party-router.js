const express = require('express');
const PartyService = require('./party-service');
const PartyRouter = express.Router();

PartyRouter
  .get('/:partyId', async (req, res, next) => {
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

module.exports = PartyRouter;