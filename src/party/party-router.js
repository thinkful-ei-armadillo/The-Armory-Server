const express = require('express');
const PartyService = require('./party-service');
const PartyRouter = express.Router();
const xss = require('xss');
const Treeize = require('treeize');

PartyRouter
  .get('/', async (req, res, next) => {
    //can filter by TAG (via tabs)
    //can search by NAME (via search bar)
    //includes a COUNT of all parties
    const { gameId } = req.params;
    const { search_filter, tag_filter, sort_filter } = req.query;
    try {
      const parties = await PartyService.getAllParties(
        req.app.get('db'),
        gameId,
        search_filter,
        tag_filter,
        sort_filter
      );
      const tree = new Treeize().setOptions({ output: { prune: false }}); //prevents removal of 'null'

      //Get user information for filled spots
      // parties.map(async party => {
      //   if (party.filled) {
      //     const { username, avatar } = await UserService.getUserInfo(); //Get this from Will
      //     party.filled = {
      //       username,
      //       avatar
      //     };
      //     return party;
      //   }
      // });

      tree.grow(parties);
      res.json(tree.getData());

      next();
    } catch(error) {
      next(error);
    }
  });

module.exports = PartyRouter;