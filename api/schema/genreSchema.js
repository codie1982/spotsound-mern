const mongoose = require("mongoose");
const genreSchema = new mongoose.Schema({
  title: { type: String },
  image: { type: mongoose.Schema.Types.ObjectId, ref: "images" }
}, { timestamps: true });

module.exports = genreSchema;