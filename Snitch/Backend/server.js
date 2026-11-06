import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
