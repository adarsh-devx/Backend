const songModel = require("../models/song.model");
const id3 = require("node-id3");
const storageService = require("../services/storage.service");

async function uploadSong(req, res) {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({
          message:
            "No song file uploaded. Please attach a file with key 'song'.",
        });
    }

    // extract metadata
    const songBuffer = req.file.buffer;
    const mood = req.body.mood;
    const tags = id3.read(songBuffer);

    // upload song & poster to storage in parallel
    const [songFile, posterFile] = await Promise.all([
      storageService.uploadFile(
        songBuffer,
        tags.title + ".mp3",
        "/Backend/day-13/songs",
      ),
      storageService.uploadFile(
        tags.image.imageBuffer,
        tags.title + ".jpeg",
        "/Backend/day-13/posters",
      ),
    ]);

    const song = await songModel.create({
      title: tags.title,
      url: songFile.url,
      posterUrl: posterFile.url,
      mood: mood,
    });

    res.status(201).json({ message: "song created successfully", song });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getSong(req, res) {
  try {
    const { mood } = req.query;
    const song = await songModel.findOne({ mood });

    res.status(200).json({ message: "song fetched successfully", song });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  uploadSong,
  getSong,
};
