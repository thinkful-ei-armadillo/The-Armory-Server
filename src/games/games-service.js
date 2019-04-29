const GamesService = {
  getAllGames(db) {
    return db
      .select('*')
      .from('games');
  },
  getPartyCount(db) {
    // select games.id, count(party.game_id) as party_count from games left join party on party.game_id = games.id group by 1;
    return db
      .select('games.id')
      .count('party.game_id as party_count')
      .from('games')
      .leftJoin('party', 'games.id', 'party.game_id')
      .groupBy(1);
  },
  getGameById(db, id) {
    return db
      .select('*')
      .from('games')
      .where('games.id', id)
      .first();
  },
  getAllParties(db, gameId) {
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
      .where('p.game_id', gameId)
      .andWhere('p.filled', false)
      .andWhere('p.ready', true);
  },



};

module.exports = GamesService;