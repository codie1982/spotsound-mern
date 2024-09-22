const mongoose = require("mongoose");
const uploadSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId },
  uploadid: { type: String },
  uploadType: { type: String, enum: ["song", "video", "image"] },
  upload_size: { type: Number },
  data: { type: mongoose.Schema.Types.Mixed },
  success: { type: Boolean },
}, { timestamps: true });

module.exports = uploadSchema;