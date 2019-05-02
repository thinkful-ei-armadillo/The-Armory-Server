const express = require("express");
const gamesRouter = express.Router();
const GamesService = require("./games-service");
const url = require("url");
const UserService = require("../user/user-service");
const xss = require("xss");
const Treeize = require("treeize");

const REQUIREMENTS_STORE = require("../store/requirements");
const ROLES_STORE = require("../store/requirements");

gamesRouter.get("/", async (req, res, next) => {
  try {
    let url_parts = url.parse(req.url, true);
    let query = url_parts.query;
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

    console.log('line 33 games =', games)

    if (Object.keys(query).length > 0) {
      console.log('query.query =', query.query);
      if (query.query === undefined) {
        query.query = "";
      }
      GamesService.searchTitleQuery(req.app.get("db"), query.query.split(" "))
        .then(games => {
          res.status(200).json(games);
        })
        .catch(next);
    } else {
      console.log('line 45 =', games)
      res.status(200).json(games);
    }
  } catch(error) {
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

    res.status(200).json(game);
  } catch (error) {
    next(error);
  }
});

gamesRouter.get("/:gameId/parties", async (req, res, next) => {
  //can filter by TAG (via tabs)
  //can search by NAME (via search bar)
  //includes a COUNT of all parties
  const { gameId } = req.params;
  try {
    let parties = await GamesService.getAllParties(req.app.get("db"), gameId);
    const tree = new Treeize().setOptions({ output: { prune: false } }); //prevents removal of 'null'

    // Get user information for filled spots
    parties = await Promise.all(
      parties.map(async party => {
        if (party["spots:filled"]) {
          const { username, avatar_url } = await UserService.getUserInfo(
            req.app.get("db"),
            party["spots:filled"]
          ); //Get this from Will

          party["spots:filled"] = {
            username,
            avatar_url
          };
        }
        return party;
      })
    );

    tree.grow(parties);
    res.json(tree.getData());

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = gamesRouter;
