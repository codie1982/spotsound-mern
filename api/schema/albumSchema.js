const mongoose = require("mongoose");
const performerSchema = require("./performerSchema")
const imageSchema = require("./imageSchema")
const songSchema = require("./songSchema")
const genreSchema = require("./genreSchema")
const albumSchema = new mongoose.Schema({
  title: { type: String },
  performer: performerSchema,
  releaseDate: { type: Date },
  genre: genreSchema,
  image: imageSchema,
  songs: songSchema,
  userid: { type: mongoose.Schema.Types.ObjectId },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = albumSchema;