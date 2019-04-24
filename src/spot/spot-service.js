const SpotService = {
  getAllParties: async function(db, gameId, search_filter, tag_filter, sort_filter) {
    const parites = db
      .from('Spot')
      .select('*')
      
  },
};

module.exports = SpotService;