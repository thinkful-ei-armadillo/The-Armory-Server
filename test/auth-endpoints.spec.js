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

  describe("POST login credentials to receive a JWT token", () => {
    context("Given the wrong credentials", () => {
      it("returns an error when email is missing", () => {
        return supertest(app)
          .post("/api/auth/token")
          .send({})
          .expect(400, { error: "Missing 'email' in request body" });
      });
      it("returns an error when password is missing", () => {
        return supertest(app)
          .post("/api/auth/token")
          .send({ email: "test@gmail.com" })
          .expect(400, { error: "Missing 'password' in request body" });
      });
      it("returns an error when email and password are not found in database", () => {
        return supertest(app)
          .post("/api/auth/token")
          .send({ email: "test@gmail.com", password: "testpassword" })
          .expect(400, { error: "Incorrect email, username, or password" });
      });
    });
    context("Given the correct credentials", () => {
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
      it("responds with a JWT token given the correct email or username and password", () => {
          return supertest(app)
            .post("/api/auth/token")
            .send({ email:"armorysquad@gmail.com", username: "admin", password: "pass"} )
            .expect(200);
      });
    });
  });
});
