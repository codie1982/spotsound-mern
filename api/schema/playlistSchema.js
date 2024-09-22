const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, default: null },
  songlist: [
    { songid: mongoose.Schema.Types.ObjectId }
  ],
  active: { type: Boolean, default: true },
}, { timestamps: true });
module.exports = playlistSchema;