const xss = require('xss');
const Treeize = require('treeize');
const UserService = require('../user/user-service');

const PartyService = {
  getPartyById(db, partyId) {
    return db
      .from('party AS p')
      .select(
        'p.id',
        'p.game_id',
        'p.title',
        'p.owner_id',
        'p.description',
        'p.require_app',
        'pr.requirement_id AS reqs:id',
        's.id AS spots:id',
        's.filled AS spots:filled',
        'sr.role_id AS spots:roles:id'
      )
      .leftJoin(
        'spots AS s',
        'p.id',
        's.party_id'
      )
      .leftJoin(
        'party_requirements AS pr',
        'pr.party_id',
        'p.id'
      )
      .leftJoin(
        'spot_roles AS sr',
        'sr.spot_id',
        's.id'
      )
      .where('p.id', partyId);
  },
  getSimplePartyById: async function(db, partyId) {
    const data = await db
      .raw(`select p.*, 
        (select count(*) filter (where filled is null) as spots_left from spots where spots.party_id='${partyId}') 
        from party as p where p.id = '${partyId}'`);
    return data.rows[0];
  },
  serializeParty: async function(db, party_data) {
    const tree = new Treeize().setOptions({ output: { prune: false }}); //prevents removal of 'null'

    // Get user information for filled spots
    party_data = await Promise.all(party_data.map(async party => {
      if (party['spots:filled']) {
        const { username, avatar_url } = await UserService.getUserInfo(db, party['spots:filled']); //Get this from Will

        party['spots:filled'] = {
          username,
          avatar_url
        };
      }
      return party;
    }));

    tree.grow(party_data);
    return tree.getData();
  },
  insertParty(db, party) {
    const newParty = {
      game_id: party.game_id,
      title: xss(party.title),
      require_app: party.require_app,
      owner_id: party.owner_id,
      description: xss(party.description),
    };
    return db
      .insert(newParty)
      .into('party')
      .returning('id')
      .then(([party]) => party);
  },
  deleteParty(db, partyId) {
    return db
      .from('party')
      .where('id', partyId)
      .del();
  },
  setReady(db, party_id) {
    return db('party')
      .where('id', party_id)
      .update({ ready: true });
  }, 

  getOwnerId(db, party_id){
    return db
      .from('party')
      .where('id', party_id)
      .select('owner_id')
      .first();
  },

  updateParty(db, party_id, newParty){
    return db('party')
      .where('id', party_id)
      .update(newParty);
  }

};

module.exports = PartyService;