const knex = require("knex");
const { app } = require("../src/app");
const helpers = require("./test-helpers");

describe("User Endpoints", () => {
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

  describe("POST user", () => {
    it("responds with an error give an invalid user post", () => {
      const user = {
        username: "test",
        password: "Password1!"
      };
      return supertest(app)
        .post("/api/user/")
        .send(user)
        .expect(400);
    });
    it("responds with 201 and the user given a valid request", () => {
      const user = {
        id: 1,
        email: "test@gmail.com",
        username: "test",
        password: "Password1!"
      };
      //const expected = { id: 1, username: "test", email: "test@gmail.com" };
      return supertest(app)
        .post("/api/user")
        .send(user)
        .expect(201);
    });
  });
  describe("PATCH user", () => {
    context("given no bearer token", () => {
      it("responds with an error", () => {
        return supertest(app)
          .patch("/api/user/1")
          .expect(401, { error: "Missing bearer token" });
      });
    });
    context("given the user does not exist", () => {
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
      it('responds with an error', () => {
        return supertest(app)
          .patch("/api/user/1")
          .set("authorization", `bearer ${process.env.TEST_BEARER_TOKEN}`)
          .expect(400, {error: "Nothing to update"});
      })
    })
  });
});
