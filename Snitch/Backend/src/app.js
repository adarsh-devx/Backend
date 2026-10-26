import express from "express";
import morgan from "morgan";
import "dotenv/config";
import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import cors from "cors";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import cookieParser from "cookie-parser";
import { config } from "./config/config.js";

const app = express();

// ── Global Middlewares ────────────────────────────────────────────────────────
// Parse URL-encoded bodies and JSON payloads
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Parse incoming HTTP cookies (used for reading JWT tokens)
app.use(cookieParser());

// HTTP request logger for development
app.use(morgan("dev"));

// Enable Cross-Origin Resource Sharing (CORS) for Vite frontend with cookies enabled
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allows sending cookies across origins
  }),
);

// ── Passport Google OAuth Setup ───────────────────────────────────────────────
app.use(passport.initialize());

// Configure Google OAuth 2.0 Strategy using credentials from environment config
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback", // Handled via Vite proxy or direct redirect
    },
    (accessToken, refreshToken, profile, done) => {
      // Forward Google user profile to the callback route handler
      return done(null, profile);
    },
  ),
);

// ── Routes Mounting ──────────────────────────────────────────────────────────
// Mount authentication endpoints under /api/auth
app.use("/api/auth", authRouter);

app.use("/api/products", productRouter);

export default app;
