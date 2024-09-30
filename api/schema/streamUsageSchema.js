const mongoose = require('mongoose');

const streamUsageSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Kullanıcı referansı
    required: true
  },
  songid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song', // Şarkı referansı
    required: true
  },
  deviceId: {
    type: String, // Cihaz ID'si
    required: true
  },
  streamedBytes: {
    type: Number, // Stream edilen toplam veri miktarı (bayt cinsinden)
    default: 0,
    required: true
  },
  platform: {
    type: String, // Stream edilen platform bilgisi (örn. android, ios, web)
  },
  osVersion: {
    type: String, // İşletim sistemi versiyonu
  },
  appVersion: {
    type: String, // Uygulama versiyonu
  },
  ipAddress: {
    type: String, // Cihazın IP adresi
  },
  lastStreamedAt: {
    type: Date, // Son stream edilen zaman
    default: Date.now
  }
}, { timestamps: true });

module.exports = streamUsageSchema;