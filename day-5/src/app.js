const express = require("express");

const app = express();

app.use(express.json());

const notes = [];

app.post("/notes", (req, res) => {
  console.log(req.body);

  notes.push(req.body);

  res.status(201).json({
    message: "note created",
  });
});

app.get("/notes", (req, res) => {
  res.status(200).json({
    notes: notes,
  });
});

app.delete("/notes/:id", (req, res) => {
  delete notes[req.params.id];
  res.status(200).json({
    message: "note deleted",
  });
});

app.patch("/notes/:id", (req, res) => {
  notes[req.params.id].description = req.body.description;
  
  res.status(200).json({
    message: "Note Updated",
  });
});

module.exports = app;
