const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  name: { type: String },
  title: { type: String },
  content: { type: String },
  features: [
    { item: { type: String } }
  ],
  type: { type: String },
  expireTime: { type: Date },
  uploadsonglimit: { type: Number, default: 0 },
  uploadvideolimit: { type: Number, default: 0 },
  google_channel: { type: String },
  apple_channel: { type: String },
  delete: { type: Boolean, default: false },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = packageSchema;