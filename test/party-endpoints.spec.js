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
      it("responds with 401 unauthorized when no bearer token provided", () => {
        return supertest(app)
          .post("/api/parties")
          .expect(401);
      });
      it("responds with an invalid request when bearer token provided but invalid request body", () => {

      })
    });
  });
});
