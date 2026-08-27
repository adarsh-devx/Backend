import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);



import "dotenv/config"
import app from "./src/app.js";
import connectDB from "./src/config/database.js";

const PORT = process.env.PORT || 3000;

connectDB()
.catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
