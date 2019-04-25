const express = require("express");
const gamesRouter = express.Router();
const GamesService = require("./games-service");
const UserService = require('../user/user-service');
const xss = require('xss');
const Treeize = require('treeize');

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

gamesRouter
  .get('/:gameId/parties', async (req, res, next) => {
    //can filter by TAG (via tabs)
    //can search by NAME (via search bar)
    //includes a COUNT of all parties
    const { gameId } = req.params;
    try {
      let parties = await GamesService.getAllParties(
        req.app.get('db'),
        gameId
      );
      const tree = new Treeize().setOptions({ output: { prune: false }}); //prevents removal of 'null'

      // Get user information for filled spots
      parties = await Promise.all(parties.map(async party => {
        if (party['spots:filled']) {
          const { username, avatar_url } = await UserService.getUserInfo(req.app.get('db'), party['spots:filled']); //Get this from Will

          party['spots:filled'] = {
            username,
            avatar_url
          };
        }
        return party;
      }));

      tree.grow(parties);
      res.json(tree.getData());

      next();
    } catch(error) {
      next(error);
    }
  });

module.exports = gamesRouter;
