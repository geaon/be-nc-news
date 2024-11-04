const express = require("express");
const app = express();
const {
  getTopics,
  getArticleById,
  getArticles,
  getArticleComments,
  postComments,
  patchArticle,
  deleteComment,
  getUsers,
} = require("./controllers/controllers");
const endpoints = require("./endpoints.json");
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints: endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postComments);

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers);

app.use((err, request, response, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    response.status(400).send({ message: "bad request" });
  } else if (err.code === "23503") {
    response.status(404).send({ message: "user does not exist" });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.status && err.message) {
    response.status(err.status).send({ message: err.message });
  } else {
    console.log(err);
  }
});

module.exports = app;
