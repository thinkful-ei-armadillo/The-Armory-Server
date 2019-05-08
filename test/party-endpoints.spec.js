const knex = require("knex");
const { app } = require("../src/app");
const helpers = require("./test-helpers");

describe("Party Endpoints", () => {
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

  describe("POST party", () => {
    context("Given an invalid post party request", () => {
      beforeEach("insert seed data", () => {
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
        return db.into("users").insert(user);
      });
      it("responds with 401 unauthorized when no bearer token provided", () => {
        return supertest(app)
          .post("/api/parties")
          .expect(401);
      });
      it("responds with an invalid request when bearer token provided but invalid request body", () => {
        return supertest(app)
          .post("/api/parties")
          .set("Authorization", `Bearer ${process.env.TEST_BEARER_TOKEN}`)
          .expect(500);
      });
    });
  });
  describe("GET party by id", () => {
    context("Given a valid GET request", () => {
      beforeEach("insert seed data", () => {
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
        return db
          .into("users")
          .insert(user)
          .then(() => db.into("games").insert(gamesArray))
          .then(() => db.into("party").insert(party));
      });
      it("returns the party", () => {
        const expected = {
          id: "fb1d3c63-6a72-4013-be82-5b523c1dd1cd",
          game_id: "aa0e8ce9-1a71-42e7-804d-6838556fa6ed",
          title: "Admin",
          owner_id: 1,
          description: "This is a description of this party.",
          require_app: true,
          gamemode: { name: "Quick Play", icon_url: "" },
          reqs: [{}],
          spots: [{ id: null, filled: null, roles: [{}] }]
        };
        return supertest(app)
          .get("/api/parties/fb1d3c63-6a72-4013-be82-5b523c1dd1cd")
          .expect(200, expected);
      });
    });
  });
  describe("GET messages from specific party", () => {
    context("given there are parties available", () => {
      beforeEach("insert seed data", () => {
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
        return db
          .into("users")
          .insert(user)
          .then(() => db.into("games").insert(gamesArray))
          .then(() => db.into("party").insert(party));
      });
      it("responds with 200 and an empty array when no messages", () => {
        return supertest(app)
          .get("/api/parties/messages/fb1d3c63-6a72-4013-be82-5b523c1dd1cd")
          .expect(200, []);
      });
    });
    context("given there are messages", () => {
      beforeEach("insert seed data", () => {
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
        const message = {
          id: "4f4698c2-e6c3-45f7-a180-91b6d4205164",
          party_id: "fb1d3c63-6a72-4013-be82-5b523c1dd1cd",
          owner_id: 1,
          message_body: "hello",
          time_created: "11:00AM",
          unix_stamp: 1,
          edited: false
        };
        return db
          .into("users")
          .insert(user)
          .then(() => db.into("games").insert(gamesArray))
          .then(() => db.into("party").insert(party))
          .then(() => db.into("party_messages").insert(message));
      });
      it("responds with the messages when there are messages", () => {
        const expected = [
          {
            avatar_url:
              "https://i.ebayimg.com/images/g/PfAAAOSwA3dYIPRN/s-l300.jpg",
            edited: false,
            email: "armorysquad@gmail.com",
            id: "4f4698c2-e6c3-45f7-a180-91b6d4205164",
            message_body: "hello",
            party_id: "fb1d3c63-6a72-4013-be82-5b523c1dd1cd",
            time_created: "11:00AM",
            user_id: 1,
            username: "admin"
          }
        ];
        return supertest(app)
          .get("/api/parties/messages/fb1d3c63-6a72-4013-be82-5b523c1dd1cd")
          .expect(200, expected);
      });
    });
  });
});
