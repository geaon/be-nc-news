# Northcoders News API

## Welcome to my backend API!

Acces the hosted version here:<br/>
https://be-nc-news-osc4.onrender.com/api/

## Project Information

This project was built using Node.js, allowing interaction with a PostgreSQL (PSQL) database. It follows RESTful principles and adheres to the Model-View-Controller (MVC) pattern. The API offers Create, Read, Update, and Delete (CRUD) operations through various endpoints and Test Driven Development (TDD) was used to ensure the code met expected outcomes.

You can use this API to view articles, topics, users and comments within the nc_news datatbase. You can retrieve articles based on specific queries, post new comments on articles and delete comments.

## Project Setup

To run the project on your local machine, ensure you have the following installed and clone the repository:<br/>
__--Node.js version 22.8.0 or later__<br/>
__--PostgreSQL version 17 or later__

Run __--npm install__ in your terminal.

Ensure you have the required dependencies:<br/>
__"dependencies": {<br/>
"cors": "^2.8.5",<br/>
"dotenv": "^16.0.0",<br/>
"express": "^4.21.1",<br/>
"pg": "^8.7.3",<br/>
"pg-format": "^1.0.4",<br/>
"sorted": "^0.1.1",<br/>
"supertest": "^7.0.0"<br/>
},__

Add test and development environments using PGDATABASE by creating the files below. These are essential for connecting to the correct databases:<br/>
--create a __.env.test__ file with __PGDATABASE = nc_news_test__<br/>
--create a __.env.development__ file with __PGDATABASE = nc_news__<br/>

To seed the local database, run:<br/>
__--npm run seed__

To run the test suite, run:<br/>
__--npm test__

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
