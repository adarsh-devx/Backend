const mongoose = require("mongoose");



async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("data base is connected");
  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
