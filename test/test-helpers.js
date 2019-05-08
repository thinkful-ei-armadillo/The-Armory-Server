function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      archived_messages, party_messages, party, party_requirements, party_apps, spot_roles, spots, games, users`
  );
}

module.exports = {
  cleanTables
};
