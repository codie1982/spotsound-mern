const mongoose = require("mongoose");
const albumSchema = new mongoose.Schema({
  title: { type: String },
  performers: [
    { performerid: { type: mongoose.Schema.Types.ObjectId } }
  ],
  releaseDate: { type: Date },
  genres: [{ type: mongoose.Schema.Types.ObjectId }],
  images: [
    { imageid: { type: mongoose.Schema.Types.ObjectId } }
  ],
  songs: [
    { songid: { type: mongoose.Schema.Types.ObjectId } }
  ],
  userid: { type: mongoose.Schema.Types.ObjectId },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = albumSchema;