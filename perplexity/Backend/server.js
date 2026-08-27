import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);



import "dotenv/config"
import app from "./src/app.js";
import http from "http"
import { initSocket } from "./src/sockets/server.socket.js";

import connectDB from "./src/config/database.js";


const httpServer = http.createServer(app);
initSocket(httpServer);

const PORT = process.env.PORT || 3000;

connectDB()
.catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});


httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
