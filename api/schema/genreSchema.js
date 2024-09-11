const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: { type: String },
}, { timestamps: true });

module.exports = genreSchema;