const GamesService = {
    getAllGames(db) {
        return db
        .select('*')
        .from('games')
    },
    getPartyCount(db) {
        // select games.id, count(party.game_id) as party_count from games left join party on party.game_id = games.id group by 1;
        return db 
        .select('games.id')
        .count('party.game_id as party_count')
        .from('games')
        .leftJoin('party', 'games.id', 'party.game_id')
        .groupBy(1)
    }
}

module.exports = GamesService