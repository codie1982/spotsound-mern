const mongoose = require("mongoose");

//userid ve key ortak eleman bunları sınırlayarak eklemeler yapmamız gerekiyor.
const downloadSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, require: true },
  key: { type: String },
  count: { type: Number },
  dinfo: [
    {
      downloadid: { type: String },
      device: { type: String, enum: ["web", "android", "ios"] },
      data: { type: mongoose.Schema.Types.Mixed }
    }
  ],
}, { timestamps: true });

module.exports = downloadSchema;