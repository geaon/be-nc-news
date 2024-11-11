# Northcoders News API

Welcome to my backend API!

Acces the hosted version here:
https://be-nc-news-osc4.onrender.com/api/

This project was built using Node.js, allowing interaction with a PostgreSQL (PSQL) database. It follows RESTful principles and adheres to the Model-View-Controller (MVC) pattern. The API offers Create, Read, Update, and Delete (CRUD) operations through various endpoints and Test Driven Development (TDD) was used to ensure the code met expected outcomes.

You can use this API to view articles, topics, users and comments within the nc_news datatbase. You can retrieve articles based on specific queries, post new comments on articles and delete comments.

To run the project on your local machine, ensure you have the following installed and clone the repository:
--Node.js version 22.8.0 or later
--PostgreSQL version 17 or later

Run:
--npm install
and ensure you have the required dependencies:
"dependencies": {
"cors": "^2.8.5",
"dotenv": "^16.0.0",
"express": "^4.21.1",
"pg": "^8.7.3",
"pg-format": "^1.0.4",
"sorted": "^0.1.1",
"supertest": "^7.0.0"
},

Add test and development environments using PGDATABASE by creating the files below. These are essential for connecting to the correct databases:
-create a .env.test file with PGDATABASE = nc_news_test
-create a .env.development file with PGDATABASE = nc_news

To seed the local database, run:
--npm run seed

To run the test suite, run:
--npm test

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
