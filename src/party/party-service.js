const PartyService = {
  getAllParties(db, gameId) {
    let baseRequest = db
      .from('party AS p')
      .select(
        'p.id',
        'p.game_id',
        'p.title',
        'p.owner_id',
        'p.description',
        'p.require_app',
        'pr.requirement_id AS reqs:title',
        's.id AS spots:id',
        's.filled AS spots:filled',
        'sr.role_id AS spots:roles:title'
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
      .where('p.game_id', gameId);

    //MOVE ROLES AND REQUIREMENTS TO A STORE.JS, ELIMINATE THE LEFT JOIN
    return baseRequest;
  },
};

module.exports = PartyService;