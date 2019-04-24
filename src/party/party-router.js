const express = require('express');
const PartyService = require('./party-service');
const PartyRouter = express.Router();
const xss = require('xss');
const Treeize = require('treeize');
const UserService = require('../user/user-service');

PartyRouter
  .get('/:gameId/parties', async (req, res, next) => {
    //can filter by TAG (via tabs)
    //can search by NAME (via search bar)
    //includes a COUNT of all parties
    const { gameId } = req.params;
    try {
      let parties = await PartyService.getAllParties(
        req.app.get('db'),
        gameId
      );
      const tree = new Treeize().setOptions({ output: { prune: false }}); //prevents removal of 'null'

      // Get user information for filled spots
      parties = await Promise.all(parties.map(async party => {
        if (party['spots:filled']) {
          const { id, username, avatar_url } = await UserService.getUserInfo(req.app.get('db'), party['spots:filled']); //Get this from Will
          party['spots:filled'] = {
            id,
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

module.exports = PartyRouter;