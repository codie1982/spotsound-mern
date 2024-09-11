const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  name: { type: String },
}, { timestamps: true });

module.exports = playlistSchema;