const mongoose = require('mongoose');


const connectToD = () =>{
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('database connected');
        
    })
}


module.exports = connectToD 