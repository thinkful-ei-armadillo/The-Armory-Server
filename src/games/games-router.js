const express = require("express");
const gamesRouter = express.Router();
const GamesService = require("./games-service");

gamesRouter.get("/", async (req, res, next) => {
  try {
    const games = await GamesService.getAllGames(req.app.get("db"));
    const partyCount = await GamesService.getPartyCount(req.app.get("db"));
    const array = [];

    games.map(game => {
      const match = partyCount.find(item => item.id === game.id);
      game.party_count = match.party_count;
      array.push(game);
    });

    res.status(200).json(games);
  } catch (error) {
    next(error);
  }
});

gamesRouter.route("/:id").get(async (req, res, next) => {
  try {
    const { id } = req.params;
    const game = await GamesService.getGameById(req.app.get("db"), id);
    const partyCount = await GamesService.getPartyCount(req.app.get("db"));
    const gameParty = partyCount.find(item => item.id === game.id);

    game.party_count = gameParty.party_count;

    res.status(200).json(game);
  } catch (error) {
    next(error);
  }
});
module.exports = gamesRouter;
