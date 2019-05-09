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
    await roles.forEach(async function(role) {
      await db('spot_roles').insert({
        spot_id: spotId,
        role_id: role
      });
    });
  },
  updateSpot(db, spot_id, newSpot) {
    return db('spots')
      .where('id', spot_id)
      .update(newSpot);
  }, 
  getSpotById(db, id){
    console.log('huh?', id);
    return db
      .select('*')
      .from('spots')
      .where({id})
      .first();
  }, 
  getNewOwnerId(db, owner_id, party_id){
    return db
      .select('filled')
      .from('spots')
      .whereNot('filled', null)
      .whereNot('filled', owner_id)
      .andWhere({party_id});
  },
  findUserSpot(db, user_id, party_id){
    return db 
      .select('id')
      .from('spots')
      .where('filled', user_id)
      .andWhere({party_id})
      .first();
  },
  getSpotsLeft: function(db, partyId) {
    return db
      .count('*')
      .from('spots')
      .where('party_id', partyId)
      .andWhere('filled', null);
  },
  getSpotByUserId: function(db, userId) {
    return db('spots')
      .select('*')
      .where('filled', userId)
      .first();
  }
};

module.exports = SpotService;
