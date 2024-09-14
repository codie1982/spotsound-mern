const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  name: { type: String },
  expireTime: { type: Date },
  limit: { type: Number },
  googleid: { type: Number },
}, { timestamps: true });

module.exports = accountSchema;