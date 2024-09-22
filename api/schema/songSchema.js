const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  name: { type: String },
  uploadid: { type: String, require: true },
  performers: [
    { performerid: { type: mongoose.Schema.Types.ObjectId, ref: "performer", } }
  ],
  downloadble: { type: Boolean },
  streamble: { type: Boolean },
  genre: { type: mongoose.Schema.Types.ObjectId, ref: "genre", },
  raiting: { type: Number },
  count: { type: Number },
  like: { type: Number },
  hasLyrics: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = songSchema;