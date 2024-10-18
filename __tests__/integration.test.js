const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
  test("GET:200 responds with object detailing all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe("/api/topics", () => {
  test("GET:200 responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).not.toBe(0);
        body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET:200 responds with a single article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.article.author).toBe("string");
        expect(typeof body.article.title).toBe("string");
        expect(typeof body.article.article_id).toBe("number");
        expect(typeof body.article.body).toBe("string");
        expect(typeof body.article.topic).toBe("string");
        expect(typeof body.article.created_at).toBe("string");
        expect(typeof body.article.votes).toBe("number");
        expect(typeof body.article.article_img_url).toBe("string");
        expect(typeof body.article.comment_count).toBe("string");
      });
  });
  test("GET:404 responds with appropriate error status and message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/1800")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toEqual("article does not exist");
      });
  });
  test("GET:400 responds with an appropriate error status and message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/no")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("bad request");
      });
  });
});

describe("/api/articles", () => {
  test("GET:200 responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).not.toBe(0);
        body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
        });
      });
  });
  test("GET:200 responds with articles sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("/api/articles?sort_by=...", () => {
  test("GET:200 takes a sort_by query and responds with articles sorted by the given column", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("author", { descending: true });
      });
  });
  test("GET:400 returns appropriate error status and message when given an invlaid sort_by", () => {
    return request(app)
      .get("/api/articles?sort_by=made_up")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
});

describe("/api/articles?order=...", () => {
  test("GET:200 takes an order query and responds with articles ordered ascending or descending", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", { ascending: true });
      });
  });
});

describe("/api/articles?topic=...", () => {
  test("GET:200 takes a topic query and responds with articles of that topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) =>
        body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        })
      );
  });
  test("GET:404 responds with appropriate error status and message when given a valid but non-existent topic", () => {
    return request(app)
      .get("/api/articles?topic=boats")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toEqual("topic does not exist");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET:200 responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).not.toHaveLength(0);
        body.comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  test("GET:200 responds with most recent comments first (comments sorted by date in descending order)", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET:404 responds with appropriate error status and message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/1800/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toEqual("article does not exist");
      });
  });
  test("GET:400 responds with an appropriate error status and message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/no/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("bad request");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("POST:201 - adds a comment to the given article", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "lurker", body: "riveting article" })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          author: "lurker",
          body: "riveting article",
          article_id: 2,
        });
      });
  });
  test("POST:404 responds with appropriate error status and message when given a valid but non-existent article_id", () => {
    return request(app)
      .post("/api/articles/1800/comments")
      .send({ username: "lurker", body: "riveting article" })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toEqual("article does not exist");
      });
  });
  test("POST:400 responds with an appropriate error status and message when given an invalid article_id", () => {
    return request(app)
      .post("/api/articles/no/comments")
      .send({ username: "lurker", body: "riveting article" })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("bad request");
      });
  });
  test("POST:400 responds with an appropriate error status and message when comment object is missing a property", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ body: "riveting article" })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("bad request");
      });
  });
  test("POST:404 responds with an appropriate error status and message when given username of user who doesnt exist", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "georgia", body: "riveting article" })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toEqual("user does not exist");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("PATCH:201 - updates a given article by adding 1 vote", () => {
    return request(app)
      .patch("/api/articles/5")
      .send({ inc_votes: 1 })
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 5,
          title: "UNCOVERED: catspiracy to bring down democracy",
          topic: "cats",
          author: "rogersop",
          body: "Bastet walks amongst us, and the cats are taking arms!",
          created_at: "2020-08-03T13:14:00.000Z",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          votes: 1,
        });
      });
  });
  test("PATCH:201 - updates a given article by adding multiple votes", () => {
    return request(app)
      .patch("/api/articles/5")
      .send({ inc_votes: 100 })
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 5,
          title: "UNCOVERED: catspiracy to bring down democracy",
          topic: "cats",
          author: "rogersop",
          body: "Bastet walks amongst us, and the cats are taking arms!",
          created_at: "2020-08-03T13:14:00.000Z",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          votes: 100,
        });
      });
  });
  test("PATCH:404 - responds with appropriate error status and message when given a valid but non-existent article_id", () => {
    return request(app)
      .patch("/api/articles/1800")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toEqual("article does not exist");
      });
  });
  test("PATCH:400 - responds with an appropriate error status and message when given an invalid article_id", () => {
    return request(app)
      .patch("/api/articles/no")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("bad request");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE:204 deletes the given comment by comment_id", () => {
    return request(app)
      .delete("/api/comments/3")
      .expect(204)
      .then(({ body }) => expect(body).toMatchObject({}));
  });
  test("DELETE:404 responds with appropriate error status and error message when given a valid but non-existent comment_id", () => {
    return request(app)
      .delete("/api/comments/1800")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("comment does not exist");
      });
  });
  test("DELETE:400 responds with an appropriate error status and error message when given an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/no")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
});

describe("/api/users", () => {
  test("GET:200 responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).not.toBe(0);
        body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});
