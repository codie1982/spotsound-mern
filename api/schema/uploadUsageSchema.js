const mongoose = require("mongoose");
const uploadUsageSchema = new mongoose.Schema({
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
  upload_type: {
    type: String,
    enum: ["song", "video","image"],
  },
  upload_size: {
    type: Number, // Kullanıcının bu paket üzerinden yaptığı toplam yükleme miktarı Kullanımlar kb olarak ekleniyor.
    default: 0,
  },
  upload_size_unit: {
    type: String, // Kullanıcının bu paket üzerinden yaptığı toplam yükleme miktarı Kullanımlar kb olarak ekleniyor.
    default: "kb",
  }
}, { timestamps: true });

module.exports = uploadUsageSchema;