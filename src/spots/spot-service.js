const xss = require('xss');

const SpotService = {
  insertSpot: async function(db, party_id, roles, userId) {
    const spotId = await db
      .insert({
        party_id,
        filled: userId
      })
      .into('spots')
      .returning('id')
      .then(([spot]) => spot);
    await Promise.all(roles.map(async function(role) {
      await db
        .insert({
          spot_id: spotId,
          role_id: role,
        });
    }));
  },
};

module.exports = SpotService;