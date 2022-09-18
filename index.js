const server = require("./server.js");
// require("Dotenv").config();

const PORT = process.env.PORT || 3000;

console.log(process.env.PORT);

server.listen(PORT, () => {
  console.log("Listening at http://localhost:8081");
});
