const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  name: { type: String },
}, { timestamps: true });

module.exports = songSchema;