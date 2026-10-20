import express from "express";
import runGraph from "./services/graph.ai.service.js"
import cors from 'cors';

const app = express()
app.use(express.json())

/**
 * Vite moves to the next free port (5174, 5175, …) whenever 5173 is taken,
 * so hardcoding one origin breaks the moment a second dev server starts.
 * Allow any localhost port in development, plus an optional CORS_ORIGIN env
 * override (comma-separated) for a deployed frontend.
 */
const DEV_ORIGIN_PATTERN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // No Origin header = same-origin or non-browser client: allow.
    if (!origin || DEV_ORIGIN_PATTERN.test(origin) || ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    callback(null, false);
  },
  methods : ['GET' , 'POST'],
  credentials : true
}));

app.get('/' , async ( req , res) => {
    const result = await runGraph('Write an code for Factorial function in js')
    res.json(result)
})

/** Read and trim the problem statement; null when missing or blank. */
function readProblem(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const input = (body as { input?: unknown }).input;
  if (typeof input !== "string") return null;
  const trimmed = input.trim();
  return trimmed.length > 0 ? trimmed : null;
}

app.post('/invoke' , async ( req , res) => {
    const problem = readProblem(req.body);
    if (!problem) {
        return res.status(400).json({
            success : false,
            error : 'Request body must include a non-empty "input" problem statement.'
        })
    }

    try {
        const result = await runGraph(problem)
        res.status(200).json({
            message : "Graph executed successfully",
            success : true,
            result
        })
    } catch (error) {
        console.error("[/invoke] graph execution failed:", error);
        res.status(502).json({
            success : false,
            error : "The comparison could not be generated. Please try again."
        })
    }
})

export default app;