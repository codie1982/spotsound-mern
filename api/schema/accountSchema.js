const mongoose = require("mongoose");
const packageSchema = require("../schema/packageSchema")
const accountSchema = new mongoose.Schema({
  userid: { type: String },
  usege: { type: Number },
  packages: [{ type: packageSchema }]
}, { timestamps: true });

module.exports = accountSchema;