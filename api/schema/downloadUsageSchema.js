const mongoose = require("mongoose");
const downloadUsageSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  packageid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'packages',
    required: true
  },
  download_type: {
    type: String,
    enum: ["song", "video", "image"],
  },
  download_size: {
    type: Number, // Kullanıcının bu paket üzerinden yaptığı toplam yükleme miktarı Kullanımlar kb olarak ekleniyor.
    default: 0,
  },
  download_size_unit: {
    type: String, // Kullanıcının bu paket üzerinden yaptığı toplam yükleme miktarı Kullanımlar kb olarak ekleniyor.
    default: "kb",
  },
  count: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = downloadUsageSchema;