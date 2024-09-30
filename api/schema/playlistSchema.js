const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  songlist: [
    { songid: mongoose.Schema.Types.ObjectId }
  ],
  active: { type: Boolean, default: false },
  userid: { type: mongoose.Schema.Types.ObjectId, default: null },
}, { timestamps: true });
module.exports = playlistSchema;