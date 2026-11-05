import express from "express";
import morgan from "morgan";
import "dotenv/config";
import helmet from "helmet";
import cors from "cors";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import cookieParser from "cookie-parser";
import { config } from "./config/config.js";
import { apiLimiter } from "./middlewares/rateLimiter.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";

const app = express();

// ── Security Headers with Helmet ──────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allows loading assets from external CDNs (ImageKit, Google)
    contentSecurityPolicy: false, // Prevents breaking OAuth redirects while retaining clickjacking & MIME protection
  }),
);

// ── Global Rate Limiting ──────────────────────────────────────────────────────
app.use("/api", apiLimiter);

// ── Body Parsing & Cookie Parser ──────────────────────────────────────────────
// Limit JSON payload to 16KB to prevent memory exhaustion attacks (multer handles larger image buffers)
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// ── Request Logging ───────────────────────────────────────────────────────────
if (config.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ── Dynamic Cross-Origin Resource Sharing (CORS) ──────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server) or from allowed origins
      if (!origin || config.ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy violation: Origin not allowed"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true, // Enables cookie transmission across origins
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
      callbackURL: "/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    },
  ),
);

// ── Health Check Endpoint ─────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// ── Routes Mounting ──────────────────────────────────────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);

// ── Centralized Error Handling ────────────────────────────────────────────────
app.use(errorHandler);

export default app;
