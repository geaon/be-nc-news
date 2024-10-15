const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topic-controller");

app.use(express.json());

app.get("/api/topics", getTopics);

app.use((err, request, response, next) => {
  if (err.status && err.message) {
    response.status(err.status).send({ message: err.message });
  }
});
module.exports = app;
