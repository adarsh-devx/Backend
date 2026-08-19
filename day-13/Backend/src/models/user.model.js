const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password:{
    type: String,
    required: true,
  }
});

const userModel = mongoose.model("User",userSchema);
module.exports = userModel;


//TASK 


// learn -> userSchema.pre("save" , function (next) {}) -> middleware
// learn -> userSchema.post("save" , function (next) {}) -> middleware
