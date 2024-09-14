const mongoose = require("mongoose");
const imageSchema = require("./imageSchema")
const genreSchema = new mongoose.Schema({
  name: { type: String },
  image: imageSchema
}, { timestamps: true });

module.exports = genreSchema;