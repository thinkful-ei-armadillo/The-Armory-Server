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
        email: "test@gmail.com",
        username: "test",
        password: "Password1!"
      };
      return supertest(app)
        .post("/api/user")
        .send(user)
        .expect(201);
    });
  });
});
