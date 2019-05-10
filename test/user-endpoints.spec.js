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
  describe("GET user", () => {
    context("given there is a user in the database", () => {
      beforeEach("insert seed data", () => {
        const user = [
          {
            id: 1,
            username: "test",
            avatar_url:
              "https://i.ebayimg.com/images/g/PfAAAOSwA3dYIPRN/s-l300.jpg",
            email: "armorysquad@gmail.com",
            password:
              "$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG"
          }
        ];
        return db.into("users").insert(user);
      });
      it("responds with the user", () => {
        const expected = {
          userInfo: {
            avatar_url:
              "https://i.ebayimg.com/images/g/PfAAAOSwA3dYIPRN/s-l300.jpg",
            email: "armorysquad@gmail.com",
            id: 1,
            username: "test"
          }
        };
        return supertest(app)
          .get("/api/user/1")
          .expect(200, expected);
      });
    });
    context("given there a malicious user in the database", () => {
      beforeEach("insert seed data", () => {
        const user = [
          {
            id: 1,
            username: "<script>test</script>",
            avatar_url:
              "https://i.ebayimg.com/images/g/PfAAAOSwA3dYIPRN/s-l300.jpg",
            email: "armorysquad@gmail.com",
            password:
              "$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG"
          }
        ];
        return db.into("users").insert(user);
      });
      it("responds with a sanitized version of the input", () => {
        const expected = {
          userInfo: {
            avatar_url:
              "https://i.ebayimg.com/images/g/PfAAAOSwA3dYIPRN/s-l300.jpg",
            email: "armorysquad@gmail.com",
            id: 1,
            username: "<script>test</script>"
          }
        };
        //How to reset count of id primary keys in SQL within tests?
        return supertest(app)
          .get("/api/user/1")
          .expect(200, expected);
      });
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
    context("given there is nothing to update", () => {
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
      it("responds with an error", () => {
        return supertest(app)
          .patch("/api/user/1")
          .set("authorization", `bearer ${process.env.TEST_BEARER_TOKEN}`)
          .expect(400, { error: "Nothing to update" });
      });
    });
    context("given the user does exist", () => {
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
      it("responds with 201", () => {
        const updates = {
          avatar_url: "New image"
        };
        const expected = {
          updates: {
            avatar_url: "New image"
          }
        };
        return supertest(app)
          .patch("/api/user/1")
          .set("authorization", `bearer ${process.env.TEST_BEARER_TOKEN}`)
          .send(updates)
          .expect(201, expected);
      });
    });
  });
});
