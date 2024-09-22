const mongoose = require("mongoose");
const imageSchema = require("./imageSchema")
const albumGallerySchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId },
  albumid: { type: mongoose.Schema.Types.ObjectId },
  gallery: [
    {
      line: { type: Number },
      createdDate: { type: Date },
      image: imageSchema,
      active: { type: Boolean, default: false }
    }
  ],
}, { timestamps: true });

module.exports = albumGallerySchema;