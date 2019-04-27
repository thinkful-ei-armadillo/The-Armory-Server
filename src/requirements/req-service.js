const xss = require('xss');

const ReqService = {
  insertReq(db, party_id, requirement_id) {
    if (requirement_id) {
      return db
        .insert({
          party_id,
          requirement_id,
        })
        .into('party_requirements');
    } else {
      return;
    }
  },
};

module.exports = ReqService;