const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = require("./src/app.js");
const mongoose = require('mongoose');

function connectToDb (){
     mongoose.connect('mongodb+srv://rajsingh009rj_db_user:7zrV0lQaTxLbF2DI@cluster0.wkdivfi.mongodb.net/day-6')
     .then(() => {
        console.log("db is connected");
     })
}

connectToDb()

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
})




