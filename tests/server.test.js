const test = require("node:test");
const assert = require("node:assert");

const server = require("../server.js");
const { response } = require("../server.js");

test("the test works", () => {
  assert.equal(1, 1);
});

test("home route returns expected page", async () => {
  // test goes here
  const app = server.listen(9876); // We’ll use a different port to before, just so we don’t clash with any already running instances in your terminal
  const response = await fetch("http://localhost:9876"); // The Response interface of the Fetch API represents the response to a request: https://developer.mozilla.org/en-US/docs/Web/API/Response
  app.close(); //server.listen() returns http.Server. You should invoke close() on that instance (saved above to the const app)and not on server instance: ref https://stackoverflow.com/questions/14515954/how-to-properly-close-node-express-server  /  https://www.w3schools.com/nodejs/obj_http_server.asp
  assert.equal(response.status, 200);

  //   console.log(typeof response);
  //   const x = Object.getOwnPropertyNames(response);
  //   console.log(x);

  const body = await response.text(); // Text method is on the response object created by Fetch
  assert.match(body, /Hello/);
});

test("uh oh route returns expected error page", async () => {
  const app = server.listen(9876);
  const response = await fetch("http://localhost:9876/uh-oh");
  app.close();
  assert.equal(response.status, 500);
  const body = await response.text();
  assert.equal(body, "something went wrong");
});

test("/search route returns message including keyword", async () => {
  const app = server.listen(9876);
  const response = await fetch("http://localhost:9876/search?keyword=bananas");
  app.close();

  assert.equal(response.status, 200);
  const body = await response.text();
  assert.match(body, /You searched for bananas/);
});

test("/bespke error page when route not found", async () => {
  const app = server.listen(9876);
  const response = await fetch("http://localhost:9876/blah");
  app.close();
  assert.equal(response.status, 404);
  const body = await response.text();
  assert.match(body, /Page not found my friend/);
});

test("/submit route responds to POST requests", async () => {
  const app = server.listen(9876);
  const response = await fetch("http://localhost:9876/submit", {
    method: "POST",
    body: "name=oli&age=32",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  });
  app.close();

  assert.equal(response.status, 200);
  const body = await response.text();
  assert.match(body, /thanks for submitting/);
});
