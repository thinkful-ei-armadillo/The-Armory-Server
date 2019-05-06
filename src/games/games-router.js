const express = require("express");
const gamesRouter = express.Router();
const GamesService = require("./games-service");

const UserService = require('../user/user-service');
const xss = require('xss');
const Treeize = require('treeize');

const REQUIREMENT_STORE = require('../store/requirements');
const ROLES_STORE = require('../store/roles');
const GAMEMODE_STORE = require('../store/gamemodes');

const config = require('../config');
const {PARTY_DISPLAY_LIMIT} = config;
const url = require("url");

gamesRouter.get("/", async (req, res, next) => {
  try {
    const games = await GamesService.getAllGames(req.app.get("db"));
    const array = [];
    const partyCountDashboard = await GamesService.getPartyCountDashboard(req.app.get("db"));
    let url_parts = url.parse(req.url, true);
    let query = url_parts.query;
    
    await Promise.all(games.map(async game => {
      const [partyCount] = await GamesService.getPartyCount(req.app.get("db"), game.id);
      game.party_count = parseInt(partyCount.count);
      
      const gameRoles = ROLES_STORE[game.id];
      const gameRequirements = REQUIREMENT_STORE[game.id];
      game.roles = gameRoles;
      game.requirements = gameRequirements;

      array.push(game);
    }));

    if (Object.keys(query).length > 0) {
      console.log("query.query =", query.query);
      if (query.query === undefined) {
        query.query = "";
      }
      const newGames = await GamesService.searchTitleQuery(
        req.app.get("db"),
        query.query.split(" ")
      );
      console.log("QUERY.QUERY.SPLIT", query.query.split(" "));
      console.log("newGames", newGames);
      newGames.map(game => {
        const match = partyCountDashboard.find(item => item.id === game.id);
        game.party_count = match.party_count;

        const gameRoles = ROLES_STORE[game.id];
        const gameRequirements = REQUIREMENT_STORE[game.id];
        game.roles = gameRoles;
        game.requirements = gameRequirements;
        array.push(game);
      });
      console.log("NEWGAMES ===", newGames);
      res.status(200).json(newGames);
    } else {
      res.status(200).json(array);
    }
  } catch (error) {
    next(error);
  }
});

gamesRouter.route("/:id").get(async (req, res, next) => {
  // go into store for req role and send over related roles
  try {
    const { id } = req.params;
    const game = await GamesService.getGameById(req.app.get("db"), id);
    
    const gameRoles = ROLES_STORE[id];
    const gameRequirements = REQUIREMENT_STORE[id];
    const gameModes = GAMEMODE_STORE[id];
    game.roles = gameRoles;
    game.requirements = gameRequirements;
    game.gamemodes = gameModes;

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
    const { page, term, gamemode, reqs, roles, countonly } = req.query;
    try {
      let [partyCount] = await GamesService.getPartyCount(req.app.get("db"), gameId, term, gamemode, reqs, roles);
      partyCount = parseInt(partyCount.count);
      const pagesAvailable = Math.ceil(partyCount/PARTY_DISPLAY_LIMIT) || 1;
      
      if (countonly) {
        return res.json({ parties_available: partyCount, pages_available: pagesAvailable });
      }

      let parties = await GamesService.getAllParties(
        req.app.get('db'),
        gameId,
        page || 0,
        term,
        gamemode,
        reqs,
        roles
      );

      const tree = new Treeize().setOptions({ output: { prune: false }}); //prevents removal of 'null'
      tree.grow(parties);
      let partyResponse = tree.getData();

      partyResponse = await Promise.all(partyResponse.map(async (party) => {
        party.owner_id = await UserService.getUserInfo(req.app.get('db'), party.owner_id);
        party.gamemode = GAMEMODE_STORE[gameId][party.gamemode];
        party.reqs = party.reqs.map(req => {
          return {
            ...REQUIREMENT_STORE[gameId][req.id]
          };
        });
        party.spots = party.spots.map(spot => {
          return {
            ...spot,
            roles: spot.roles.map(role => {
              return {
                ...ROLES_STORE[gameId][role.id] || null
              };
            })
          };
        });
        party.title = xss(party.title);
        party.description = xss(party.description);
        return party;
      }));

      // const pages_available = await GamesService.getPartyCount

      res.json({
        game_id: gameId,
        pages_available: pagesAvailable,
        parties_available: partyCount,
        parties: partyResponse,
      });

      next();
    } catch(error) {
      next(error);
    }
  });

module.exports = gamesRouter;
