const PartyService = {
  getAllParties(db, gameId, search_filter, tag_filter, sort_filter) {
    return db
      .from('party AS p')
      .select(
        'p.id',
        'p.game_id',
        'p.title',
        'p.owner_id',
        'p.description',
        'p.require_app',
        's.id AS spots:id',
        's.filled AS spots:filled',
        'r.title AS spots:roles:title'
      )
      .leftJoin(
        'spots AS s',
        'p.id',
        's.party_id'
      )
      .leftJoin(
        'spot_roles AS sr',
        'sr.spot_id',
        's.id'
      )
      .leftJoin(
        'roles AS r',
        'sr.role_id',
        'r.id'
      );
  },
};

module.exports = PartyService;