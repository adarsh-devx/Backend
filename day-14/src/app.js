import express from "express";
import authRouter from "./routes/auth.routes.js";
import handleError from "./middleware/error.middleware.js";
import dotenv from "dotenv";

dotenv.config();


// middleware for express

const app = express();
app.use(express.json())


// router 

app.use("/api/auth", authRouter);


//error middleware at the end 
app.use(handleError);

export default app;
