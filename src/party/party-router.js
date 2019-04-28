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
