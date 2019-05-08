const knex = require("knex");
const { app } = require("../src/app");
const helpers = require("./test-helpers");

describe("Games Endpoints", () => {
  let db;
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
        const gamesArray = [
          {
            id: "1b1d0771-c2c7-4d3b-a13e-b89bbf0acbd7",
            title: "Fortnite",
            image_url:
              "https://cdn.gamerant.com/wp-content/uploads/fortnite-season-8-week-4-challenge-leak.jpg.optimal.jpg",
            tags: ["Shooter", "Battle Royale"],
            party_limit: 4
          }
        ];
        return db.into("games").insert(gamesArray);
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
  describe("GET /api/games/:id", () => {
    context("given there is a game with the specified id", () => {
      beforeEach("insert game", () => {
        const gamesArray = [
          {
            id: "1b1d0771-c2c7-4d3b-a13e-b89bbf0acbd7",
            title: "Fortnite",
            image_url:
              "https://cdn.gamerant.com/wp-content/uploads/fortnite-season-8-week-4-challenge-leak.jpg.optimal.jpg",
            tags: ["Shooter", "Battle Royale"],
            party_limit: 4
          }
        ];
        return db.into("games").insert(gamesArray);
      });
      it("responds with 200 and the specified game", () => {
        const expectedGames = {
          id: "1b1d0771-c2c7-4d3b-a13e-b89bbf0acbd7",
          title: "Fortnite",
          image_url:
            "https://cdn.gamerant.com/wp-content/uploads/fortnite-season-8-week-4-challenge-leak.jpg.optimal.jpg",
          tags: ["Shooter", "Battle Royale"],
          party_limit: 4,
          requirements: {
            "5": { name: "E-Sports" },
            "6": { name: "Public" },
            "7": { name: "Beginner" },
            "8": { name: "Passive" },
            "9": { name: "Experienced" },
            "10": { name: "Aggressive" }
          },
          gamemodes: {
            "1": { name: "Duo", icon_url: "" },
            "2": { name: "Squad", icon_url: "" },
            "3": { name: "Limited", icon_url: "" },
            "4": { name: "Playground", icon_url: "" },
            "5": { name: "Save the World", icon_url: "" }
          }
        };
        return supertest(app)
          .get("/api/games/1b1d0771-c2c7-4d3b-a13e-b89bbf0acbd7")
          .expect(200, expectedGames);
      });
    });
    context("given there is no game with specified id", () => {
      it("responds with an error", () => {
        return supertest(app)
          .get("/api/games/1b1d0771-c2c7-4d3b-a13e-b89bbf0acbd7")
          .expect(500, {
            error: {},
            message: "Cannot set property 'roles' of undefined"
          });
      });
    });
  });
  describe("GET /api/:gameId/parties", () => {
    context("given there are no parties for a given game", () => {
      beforeEach("insert a game", () => {
        const gamesArray = [
          {
            id: "1b1d0771-c2c7-4d3b-a13e-b89bbf0acbd7",
            title: "Fortnite",
            image_url:
              "https://cdn.gamerant.com/wp-content/uploads/fortnite-season-8-week-4-challenge-leak.jpg.optimal.jpg",
            tags: ["Shooter", "Battle Royale"],
            party_limit: 4
          }
        ];
        db.into("games").insert(gamesArray);
      });
      it("responds with the game id and 0 parties available", () => {
        const expectedParties = {
          game_id: "1b1d0771-c2c7-4d3b-a13e-b89bbf0acbd7",
          pages_available: 1,
          parties_available: 0,
          parties: []
        };
        return supertest(app)
          .get("/api/games/1b1d0771-c2c7-4d3b-a13e-b89bbf0acbd7/parties")
          .expect(200, expectedParties);
      });
    });
    context("given there are parties for a given game", () => {
      beforeEach("insert a game", () => {
        const user = [
          {
            id: 1,
            username: "admin",
            avatar_url:
              "https://i.ebayimg.com/images/g/PfAAAOSwA3dYIPRN/s-l300.jpg",
            email: "armorysquad@gmail.com",
            password:
              "$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG"
          }
        ];
        const gamesArray = [
          {
            id: "aa0e8ce9-1a71-42e7-804d-6838556fa6ed",
            title: "Overwatch",
            image_url:
              "https://static.playoverwatch.com/media/wallpaper/logo-burst-wide.jpg",
            tags: ["Shooter", "FPS"],
            party_limit: 6
          }
        ];
        const party = [
          {
            id: "fb1d3c63-6a72-4013-be82-5b523c1dd1cd",
            game_id: "aa0e8ce9-1a71-42e7-804d-6838556fa6ed",
            title: "Admin",
            require_app: true,
            owner_id: 1,
            description: "This is a description of this party.",
            gamemode: 1,
            ready: true
          }
        ];
        // const party_requirements = [
        //   {
        //     id: 1,
        //     requirement_id: 2,
        //     party_id: "fb1d3c63-6a72-4013-be82-5b523c1dd1cd"
        //   }
        // ];
        // const spots = [
        //   {
        //     id: "25539899-aae0-469e-92c1-a2116badc84c",
        //     party_id: "fb1d3c63-6a72-4013-be82-5b523c1dd1cd",
        //     filled: 1
        //   },
        //   {
        //     id: "64ed5ba8-78db-44c6-ae60-46e6a2a07ff9",
        //     party_id: "fb1d3c63-6a72-4013-be82-5b523c1dd1cd",
        //     filled: null
        //   }
        // ];

        // const spot_roles = [
        //   {
        //     spot_id: "64ed5ba8-78db-44c6-ae60-46e6a2a07ff9",
        //     role_id: 14
        //   },
        //   {
        //     spot_id: "64ed5ba8-78db-44c6-ae60-46e6a2a07ff9",
        //     role_id: 2
        //   }
        // ];
        // Promise.all([
        //   db.into("users").insert(user),
        //   db.into("games").insert(gamesArray),
        //   db.into("party").insert(party)
        // ]);
        return db.into('users').insert(user)
          .then(() => db.into("games").insert(gamesArray))
          .then(() => db.into("party").insert(party));
      });
      it("responds with the game and its available parties", () => {
        const expected = {
          game_id: "aa0e8ce9-1a71-42e7-804d-6838556fa6ed",
          pages_available: 1,
          parties_available: 1 || 0,
          parties: [
            {
              id: "fb1d3c63-6a72-4013-be82-5b523c1dd1cd",
              title: "Admin",
              require_app: true,
              owner_id: {
                avatar_url:
                  "https://i.ebayimg.com/images/g/PfAAAOSwA3dYIPRN/s-l300.jpg",
                email: "armorysquad@gmail.com",
                id: 1,
                username: "admin"
              },
              description: "This is a description of this party.",
              gamemode: {
                icon_url: "",
                name: "Quick Play"
              },
              reqs: [{}],
              spots: [
                {
                  filled: null,
                  id: null,
                  roles: [{}]
                }
              ]
            }
          ]
        };
        return supertest(app)
          .get("/api/games/aa0e8ce9-1a71-42e7-804d-6838556fa6ed/parties")
          .expect(200, expected);
      });
    });
  });
});
