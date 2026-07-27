
const mongoose = require('mongoose')

function connectDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("database connected successfully")
    })

}

module.exports = connectDB