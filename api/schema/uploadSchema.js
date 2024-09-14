const mongoose = require("mongoose");
const uploadSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId },
  uploadType: { type: String },
  totalsize: { type: Number },
  folder: { type: String },
  files: [
    {
      name: { type: String },
      size: { type: Number },
      mimetype: { type: String }
    }
  ],
  successfulUploads: [
    {
      name: { type: String },
      url: { type: String }
    }
  ],
  failedUploads: [
    {
      name: { type: String },
      error: { type: mongoose.Schema.Types.Mixed }
    }
  ],
  progress: { type: Number },
  successCount: { type: Number },
  failureCount: { type: Number },
}, { timestamps: true });

module.exports = uploadSchema;