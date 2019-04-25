const express = require('express');
const PartyService = require('./party-service');
const PartyRouter = express.Router();
const UserService = require('../user/user-service');
const xss = require('xss');
const Treeize = require('treeize');

PartyRouter
  .get('/:partyId', async (req, res, next) => {
    const { partyId } = req.params;
    try {
      let parties = await PartyService.getPartyById(
        req.app.get('db'),
        partyId
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

module.exports = PartyRouter;