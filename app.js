const express = require("express");
const app = express();
const { getTopics, getArticleById } = require("./controllers/controllers");
const endpoints = require("./endpoints.json");

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints: endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ message: "bad request" });
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
