const express = require("express");
const app = express();

app.use(express.json())


const notes = []

app.get("/", (req, res) => {
  res.send("hello world");
});


app.post('/notes' , (req , res) => {
    console.log(req.body);
    notes.push(req.body)

    console.log(notes);
    
    res.send('note created')
    
})

app.get('/notes' , (req , res) => {
    res.send(notes)
})

app.delete('/notes/:id' , (req , res) => {
    delete notes[req.params.id]
    res.send('note deleted')
    
    
})


app.patch('/notes/:id' , (req , res) => {
    
    notes[req.params.id].description = req.body.description
    notes[req.params.id].title = req.body.title
    res.send('note updated')

    
})

module.exports = app;
