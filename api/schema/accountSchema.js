const mongoose = require("mongoose");
const packageSchema = require("../schema/packageSchema");
const { Type } = require("@aws-sdk/client-s3");
const accountSchema = new mongoose.Schema({
  userid: { type: String },
  balance: {
    song: { type: Number },
    video: { type: Number },
  },
  packages: [{
    packageid: { type: mongoose.Schema.Types.ObjectId, require: true },
    purchase_token: { type: String },
    recipie_data: { type: String }
  }]
}, { timestamps: true });

module.exports = accountSchema;