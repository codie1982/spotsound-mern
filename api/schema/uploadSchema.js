const mongoose = require("mongoose");
const uploadSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId },
  uploadType: { type: String, enum: ["song", "video", "image"] },
  totalsize: { type: Number, default: 0, min: 0 },
  file_count: { type: Number },
  files: [
    {
      name: { type: String },
      size: { type: Number },
      mimetype: { type: String }
    }
  ],
  successfullUploads: [
    {
      name: { type: String },
      url: { type: String },
      locate: { type: String },
      folder: { type: String }
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