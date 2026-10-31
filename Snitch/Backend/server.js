import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
