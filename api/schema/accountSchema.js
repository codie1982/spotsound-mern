const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  name: { type: String },
}, { timestamps: true });

module.exports = accountSchema;