function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      archived_messages, party_messages, party, party_requirements, party_apps, spot_roles, spots, games, users`
  );
}

function makeGamesArray() {
  return [
    {
      id: "1b1d0771-c2c7-4d3b-a13e-b89bbf0acbd7",
      title: "Fortnite",
      image_url:
        "https://cdn.gamerant.com/wp-content/uploads/fortnite-season-8-week-4-challenge-leak.jpg.optimal.jpg",
      tags: ["Shooter", "Battle Royale"],
      party_limit: 4,
      party_count: 0,
      requirements: {
        "5": {
          name: "E-Sports"
        },
        "6": {
          name: "Public"
        },
        "7": {
          name: "Beginner"
        },
        "8": {
          name: "Passive"
        },
        "9": {
          name: "Experienced"
        },
        "10": {
          name: "Aggressive"
        }
      }
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
