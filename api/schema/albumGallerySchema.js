const mongoose = require("mongoose");
const imageSchema = require("./imageSchema")
const albumGallerySchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId },
  albumid: { type: mongoose.Schema.Types.ObjectId },
  images: [
    imageSchema
  ],
}, { timestamps: true });

module.exports = albumGallerySchema;