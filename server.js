const express = require("express");
const server = express();

const bodyParser = express.urlencoded({ extended: false });

const staticHandler = express.static("public");
server.use(staticHandler);

// OPTION 1: Separate route handler
// server.get("/", (request, response, next) => {
//   console.log(request.method + "" + request.url);
//   next();
// });

// OPTION 2 & 3: separate Logger function plus
// 2 = squeezing in the additional handler function to the get method route handler below
// 3 = Use server.use (see below) to run logger before all requests
function logger(request, response, next) {
  console.log(request.method + "" + request.url);
  next();
}

// OPTION 3: Use server.use to run logger before all requests
server.use(logger);

// OPTION 2, squeezing in logger function to the route handler
// server.get("/", logger, (request, response) => {
server.get("/", (request, response) => {
  const year = new Date().getFullYear();
  response.send(`
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>Home</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <h1>Hello EVERYONE, it's ${year}!!</h1>
    </body>
  </html>
`);
});

server.get("/uh-oh", (request, response) => {
  response
    .status(500)
    .set({
      "x-fake-header": "my value",
      "x-another-header": "another value",
    })
    .send("something went wrong");
});

server.get("/search", (request, response) => {
  const keyword = request.query.keyword;
  response.send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Home</title>
        <link rel="stylesheet" href="/style.css">
      </head>
      <body>
        <h1>You searched for ${keyword}!!</h1>
      </body>
    </html>`);
});

server.get("/users/:name", (request, response) => {
  const name = request.params.name;
  response.send(`<!doctype html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Home</title>
            <link rel="stylesheet" href="/style.css">
          </head>
          <body>
            <h1>Hey ${name}!!</h1>
          </body>
        </html>`);
});

server.post("/submit", bodyParser, (request, response) => {
  const name = request.body.name; // The next page needs to know the name that was submitted (prev in the body) —we can pass that in the URL using the search parameters (in a “real” app this might be stored in a cookie or database, but the URL is fine for now). We then need a new route to show the “success” page:
  const age = request.body.age;
  response.send(`thanks for submitting ${(name, age)}`);
  //   response.redirect(`/submit/success?name=${name, age}`);
});

server.get("submit/success", (request, response) => {
  const name = request.query.name;
  const age = request.query.age;
  response.send(`thanks for submitting ${(name, age)}`);
});

server.use((request, response) => {
  response.status(404).send(`<!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>Home</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
    <h1>Page not found my friend</h1>
    </body>
  </html>`);
});

module.exports = server;
