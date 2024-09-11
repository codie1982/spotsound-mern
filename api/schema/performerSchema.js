const mongoose = require("mongoose");

const performerSchema = new mongoose.Schema({
  name: { type: String },
}, { timestamps: true });

module.exports = performerSchema;