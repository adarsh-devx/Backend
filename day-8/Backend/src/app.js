// server ko create krna

// server ko config krnaa

const express = require("express");
const mongoose = require("mongoose");
const noteModel = require("./models/note.model");
const cors = require("cors");
const path = require('path');

const app = express();

app.use(cors());
app.use(express.static('./public'));
app.use(express.json());



//create
app.post("/api/notes", async (req, res) => {
  const { title, description} = req.body;

  const note = await noteModel.create({
    title,
    description
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

//update
app.patch("/api/notes/:id", async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  const note = await noteModel.findByIdAndUpdate(id, req.body);

  res.status(200).json({
    message: "note updated successfully",
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

app.use('*name' , (req , res) => {
  res.sendFile(path.join(__dirname , '../public/index.html'))
});

module.exports = app;
