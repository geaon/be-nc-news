const format = require("pg-format");
const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "article does not exist",
        });
      }
      return rows[0];
    });
};

exports.fetchArticles = (sort_by = "created_at", order = "desc", topic) => {
  const validSortBys = ["title", "topic", "author", "body", "created_at"];
  const validOrders = ["asc", "desc"];

  if (!validSortBys.includes(sort_by)) {
    return Promise.reject({ status: 400, message: "bad request" });
  }
  if (!validOrders.includes(order)) {
    return Promise.reject({ status: 400, message: "bad request" });
  }

  let queryStr =
    "SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT (comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id";

  let queryVals = [];

  if (topic) {
    queryStr += " WHERE articles.topic = $1";
    queryVals.push(topic);
  }
  queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

  return db.query(queryStr, queryVals).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, message: "topic does not exist" });
    }
    return result.rows;
  });
};

exports.fetchArticleComments = (article_id) => {
  const sql = format(
    `SELECT * FROM comments WHERE article_id = %L ORDER BY created_at DESC`,
    article_id
  );
  return db.query(sql).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "article does not exist" });
    }
    return rows;
  });
};

exports.insertComment = (article_id, username, body) => {
  return db
    .query(
      "INSERT INTO comments (article_id, author, body) VALUES($1, $2, $3) RETURNING *",
      [article_id, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateArticle = (article_id, inc_votes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *",
      [article_id, inc_votes]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeComment = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "comment does not exist",
        });
      }
      return rows;
    });
};

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users;").then((result) => {
    return result.rows;
  });
};
