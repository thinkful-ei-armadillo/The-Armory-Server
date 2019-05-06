function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      archived_messages, party_messages, party, party_requirements, party_apps, spot_roles, spots, games, users`
  );
}

function makeGamesArray() {
  return [
    {
      "id": "aa0e8ce9-1a71-42e7-804d-6838556fa6ed",
      "title": "Overwatch",
      "image_url": "https://static.playoverwatch.com/media/wallpaper/logo-burst-wide.jpg",
      "tags": '{"Shooter", "FPS"}',
      "party_limit": 6
    }
  ];
}

function makeGamesFixtures() {
  const testGames = makeGamesArray();

  return { testGames };
}

function seedGamesTable(db, games) {
  return db.into("games").insert(games);
}

module.exports = {
  cleanTables,
  seedGamesTable,
  makeGamesFixtures
};
