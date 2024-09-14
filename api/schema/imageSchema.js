const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
  type: { type: String, enum: ['internal', 'external'], default: 'internal' },
  path: { type: String, default: "" }
});

module.exports = imageSchema;