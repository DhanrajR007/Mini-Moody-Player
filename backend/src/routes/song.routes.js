const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadFile = require("../service/storage.service");
const songModel = require("../models/song.model");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/songs", upload.single("audio"), async (req, res) => {
  const fileData = await uploadFile(req.file);
  const song = await songModel.create({
    title: req.body.title,
    artist: req.body.artist,
    mood: req.body.mood,
    audio: fileData.url,
  });
  res.status(201).json({
    message: "song created successfully",
    song: song,
  });
});

router.get("/songs", async (req, res) => {
  const { mood } = req.query;
  const songs = await songModel.find({
    mood: mood,
  });
  res.status(200).json({
   message:"Songs",
   songs:songs
  })
});
module.exports = router;
