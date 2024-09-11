const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
  password: { type: String },
}, { timestamps: true });

module.exports = albumSchema;