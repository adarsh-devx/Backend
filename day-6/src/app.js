const express = require("express");
const app = express()


app.use(express.json())

const notes = []

app.post('/notes', (req, res) => {
    notes.push(req.body)
    console.log(req.body);
    
    res.status(201).json({
        message: 'Note Created'
    })
})

app.get('/notes', (req, res) => {
    res.status(200).json({
        notes: notes
    })
})






module.exports = app