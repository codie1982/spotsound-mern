const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, require: true },
  
}, { timestamps: true });

module.exports = accountSchema;