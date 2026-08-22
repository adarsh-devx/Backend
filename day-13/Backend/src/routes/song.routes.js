const express = require("express");
const router = express.Router();
const upload = require('../middlewares/upload.middleware')
const { uploadSong, getSong } = require('../controller/song.controller')

// /api/songs/
router.post('/', upload.single('song'), uploadSong)
router.get('/', getSong)

module.exports = router