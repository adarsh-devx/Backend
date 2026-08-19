require("dotenv").config();
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = require("./src/app.js");
const connectToDB = require("./src/config/database.js");

connectToDB();

app.listen(3000, () => {
  console.log("server is running om port 3000");
});
