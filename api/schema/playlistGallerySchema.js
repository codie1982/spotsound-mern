const mongoose = require("mongoose");
const imageSchema = require("./imageSchema")
const playlistGallerySchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId },
  playlistid: { type: mongoose.Schema.Types.ObjectId },
  images: [
    imageSchema
  ],
}, { timestamps: true });

module.exports = playlistGallerySchema;