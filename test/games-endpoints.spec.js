const knex = require("knex");
const { app } = require("../src/app");
const helpers = require("./test-helpers");

describe("Games Endpoints", () => {
  let db;

  const { testGames } = helpers.makeGamesFixtures();

  before("Make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe("GET /api/games/", () => {
    context("Given there are no games in the db", () => {
        it("responds with 200 and an empty array", () => {
            return supertest(app)
                .get("/api/games")
                .expect(200);
        });
    });
    context("Given there are games in the db", () => {
      beforeEach("insert games", () => {
        helpers.seedGamesTable(db, testGames);
      });
      it("responds with 200 and all games", () => {
        const expectedGames = [
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
        return supertest(app)
          .get("/api/games")
          .expect(200, expectedGames);
      });
    });
  });
});