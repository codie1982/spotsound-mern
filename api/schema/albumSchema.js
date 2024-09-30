const mongoose = require("mongoose");
const albumSchema = new mongoose.Schema({
  title: { type: String },
  performers: [
    { performerid: { type: mongoose.Schema.Types.ObjectId, ref: "performers" } }
  ],
  releaseDate: { type: Date },
  genres: [
    { genreid: { type: mongoose.Schema.Types.ObjectId, ref: "genre" } }
  ],
  images: [
    { imageid: { type: mongoose.Schema.Types.ObjectId, ref: "images" } }
  ],
  songs: [
    { songid: { type: mongoose.Schema.Types.ObjectId,ref:"songs" } }
  ],
  userid: { type: mongoose.Schema.Types.ObjectId },
  isactive: { type: Boolean, default: true },
  isdelete: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = albumSchema;