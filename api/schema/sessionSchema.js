const mongoose = require("mongoose");

// Oturum şeması tanımlama
const sessionSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  access_token: { type: String, required: true },
  refresh_token: { type: String, required: true },
  sessionid: { type: String, required: true, unique: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  geoLocation: {
    country: { type: String },
    region: { type: String },
    city: { type: String }
  },
  isp: { type: String },
  deviceInfo: {
    deviceid: { type: String },
    type: { type: String, enum: ['desktop', 'mobile', 'tablet', 'tv', 'web'], required: true }, // Cihaz türü
    browser: { type: String },    // Tarayıcı adı (web için)
    os: { type: String },         // İşletim sistemi adı
    osVersion: { type: String },  // İşletim sistemi sürümü
    deviceModel: { type: String }, // Cihaz modeli (mobil ve tablet için geçerli)
    appVersion: { type: String }   // Uygulama sürümü (mobil ve TV uygulamaları için geçerli)
  },
  wifiConnections: [
    {
      ssid: { type: String }, // WiFi ağ adı
      macAddress: { type: String } // WiFi MAC adresi
    }
  ],
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  sessionDuration: { type: Number }, // Oturum süresi (saniye)
  lastAccessedAt: { type: Date, default: Date.now },
  closedAt: { type: Date },
  closedReason: { type: String, enum: ['none', 'logout', 'timeout', 'forced'], default: 'none' },
  loginMethod: { type: String, enum: ['password', 'oauth', 'session'] },
  logoutMethod: { type: String, enum: ['manual', 'timeout', 'forced'], default: 'manual' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = sessionSchema;