
const dns = require("node:dns");
dns.setServers(['8.8.8.8', '8.8.4.4'])

require('dotenv').config()


const connectToDb = require("./src/config/database.js");
const app = require("./src/app.js");



connectToDb();

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
