import express from "express";
import morgan from "morgan";
import "dotenv/config";
import authRouter from "./routes/auth.routes.js"

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRouter)


export default app;
