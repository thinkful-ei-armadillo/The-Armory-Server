/* eslint-disable strict */
const config = require('../config');
const PARTY_DISPLAY_LIMIT = config.PARTY_DISPLAY_LIMIT;

const GamesService = {
  getAllGames(db) {
    return db.select('*').from('games');
  },
  applyFilters(
    baseRequest,
    searchterm,
    gamemode_filter,
    req_filter,
    role_filter
  ) {
    let filterRawStr = '';
    let temp = [];
    if (searchterm) {
      temp.push(`(title like '${searchterm}%' or description like '${searchterm}%')`);
    }
    if (gamemode_filter) {
      baseRequest = baseRequest.where('gamemode', gamemode_filter);
      temp.push(`gamemode = ${gamemode_filter}`);
    }
    if (role_filter) {
      if (Array.isArray(role_filter)) {
        role_filter = role_filter.join(', ');
      }
      temp.push(`id in (select party_id from spot_roles left join spots on spots.id = spot_roles.spot_id where spot_roles.role_id in (${role_filter}))`);
    }
    if (req_filter) {
      if (Array.isArray(req_filter)) {
        req_filter = req_filter.join(', ');
      }
      temp.push(`id in (select party_id from party_requirements where party_requirements.requirement_id in (${req_filter}) )`);
    }
    filterRawStr += temp.join(' AND ');
    if (filterRawStr) {
      baseRequest = baseRequest.andWhereRaw(filterRawStr);
    }

    return baseRequest;
  },
  getPartyCount(db, gameId, searchterm, gamemode_filter, req_filter, role_filter) {
    // select games.id, count(game_id) as party_count from games left join party on party.game_id = games.id group by 1;
    let baseParty = db('party');
    baseParty = this.applyFilters(baseParty, searchterm, gamemode_filter, req_filter, role_filter);

    return db({ p: baseParty })
      .count('id')
      .where('game_id', gameId)
      .andWhere('ready', true);
  },
  getGameById(db, id) {
    return db
      .select('*')
      .from('games')
      .where('games.id', id)
      .first();
  },
  getAllParties(db, gameId, page, searchterm, gamemode_filter, req_filter, role_filter) {
    let baseParty = db('party').where('game_id', gameId).andWhere('ready', true).limit(PARTY_DISPLAY_LIMIT).offset(page * PARTY_DISPLAY_LIMIT);
    baseParty = this.applyFilters(baseParty, searchterm, gamemode_filter, req_filter, role_filter);

    return db({ p: baseParty })
      .select(
        'p.id',
        'p.title',
        'p.require_app',
        'p.owner_id',
        'p.description',
        'p.gamemode',
        'pr.requirement_id AS reqs:id',
        's.id AS spots:id',
        's.filled AS spots:filled',
        'sr.role_id AS spots:roles:id'
      )
      .leftJoin('spots AS s', 'p.id', 's.party_id')
      .leftJoin('party_requirements AS pr', 'pr.party_id', 'p.id')
      .leftJoin('spot_roles AS sr', 'sr.spot_id', 's.id')
      .orderBy('p.date_posted')
      .orderBy('s.filled');
  },
  getPartyCountDashboard(db) {
    return db
      .select('games.id')
      .count('party.game_id as party_count')
      .from('games')
      .leftJoin('party', 'games.id', 'party.game_id')
      .groupBy(1);
  },
  // service for dashboard search
  searchTitleQuery(db, query) {
    return db
      .select('*')
      .from('games')
      .whereRaw(
        `LOWER(title) similar to '%(${query.join('').toLowerCase()})%'`
      );
  }
};

module.exports = GamesService;
