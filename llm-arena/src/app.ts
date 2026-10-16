import express from "express";
import useGraph from "./services/graph.ai.service.js"

const app = express()

app.get("/health", (req, res) => {
    res.status(200).json({ message: "OK" })
});

app.post('/use-graph' , async ( req , res) => {
    const result = await useGraph('What is the capital of India?')
    res.json(result)
})

export default app;