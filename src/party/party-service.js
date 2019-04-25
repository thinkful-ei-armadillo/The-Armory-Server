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
  }
};

module.exports = PartyService;