// server ko create krna

// server ko config krnaa

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const noteModel = require("./models/note.model");

const app = express();

app.use(cors());
app.use(express.json());


//create
app.post("/api/notes", async (req, res) => {
  const { title, description, age } = req.body;

  const note = await noteModel.create({
    title,
    description,
    age,
  });

  res.status(201).json({
    message: "note created succefully",
    note,
  });
});


//read or fetch
app.get("/api/notes", async (req, res) => {
  const note = await noteModel.find();

  res.status(200).json({
    message: "notes fetched successfully",
    note,
  });
});

//delete
app.delete("/api/notes/:id", async (req, res) => {
  const id = req.params.id;

  const note = await noteModel.findByIdAndDelete(id);

  res.status(200).json({
    message: "Note Deleted Successfully",
    id,
  });
});


//update
app.patch("/api/notes/:id", async (req, res) => {
  const id = req.params.id;
  const { title, description, age } = req.body;
  const note = await noteModel.findByIdAndUpdate(id, req.body);

  res.status(200).json({
    message: "note updated successfully",
    note,
  });
});

module.exports = app;
