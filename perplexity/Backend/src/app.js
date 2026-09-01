import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import morgan from "morgan";

const app = express();

// --- Built-in middleware with 50mb limit for Base64 Image Uploads ---
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true , methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(morgan("dev"));

// --- Routes ---
app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter); 

export default app;