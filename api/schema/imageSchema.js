const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
  type: { type: String, enum: ['internal', 'external'], default: 'internal' },
  userid: { type: mongoose.Schema.Types.ObjectId },
  path: { type: String, default: "" },
  uploadid: { type: mongoose.Schema.Types.ObjectId }
});

module.exports = imageSchema;