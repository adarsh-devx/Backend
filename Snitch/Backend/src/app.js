import express from "express";
import morgan from "morgan";
import "dotenv/config";
import authRouter from "./routes/auth.routes.js"
import cors from "cors"

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/api/auth', authRouter)


export default app;
