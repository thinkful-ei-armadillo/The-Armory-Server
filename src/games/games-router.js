const express = require("express");
const gamesRouter = express.Router();
const GamesService = require("./games-service");
const REQUIREMENTS_STORE = require('../store/requirements');
const ROLES_STORE = require('../store/requirements');

gamesRouter.get("/", async (req, res, next) => {
  try {
    const games = await GamesService.getAllGames(req.app.get("db"));
    const partyCount = await GamesService.getPartyCount(req.app.get("db"));
    const array = [];

    games.map(game => {
      const match = partyCount.find(item => item.id === game.id);
      game.party_count = match.party_count;

      const gameRoles = ROLES_STORE[game.id];
      const gameRequirements = REQUIREMENTS_STORE[game.id];
      game.roles = gameRoles;
      game.requirements = gameRequirements;

      array.push(game);
    });

    res.status(200).json(games);
  } catch (error) {
    next(error);
  }
});

gamesRouter.route("/:id").get(async (req, res, next) => {
  // go into store for req role and send over related roles
  try {
    const { id } = req.params;
    const game = await GamesService.getGameById(req.app.get("db"), id);
    const partyCount = await GamesService.getPartyCount(req.app.get("db"));
    const gameParty = partyCount.find(item => item.id === game.id);

    const gameRoles = ROLES_STORE[id];
    const gameRequirements = REQUIREMENTS_STORE[id];
    game.roles = gameRoles;
    game.requirements = gameRequirements;

    game.party_count = gameParty.party_count;
   
    console.log(game);
    res.status(200).json(game);
  } catch (error) {
    next(error);
  }
});
module.exports = gamesRouter;
