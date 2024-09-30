const mongoose = require("mongoose");

const downloadSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // İndiren kullanıcı
  uploadid: { type: mongoose.Schema.Types.ObjectId, ref: 'Upload', required: true }, // İndirilen içeriğin ID'si
  devices: [
    {
      deviceId: { type: String, required: true }, // Cihazın benzersiz ID'si (UUID vb.)
      deviceModel: { type: String, required: true }, // Cihazın modeli (iPhone, Samsung Galaxy vs.)
      osVersion: { type: String, required: true }, // İşletim sistemi sürümü (iOS 14, Android 11 vs.)
      platform: {
        type: String,
        enum: ['android', 'ios', 'tv', 'web'], // Android, iOS, TV, Web
        required: true
      },
      networkInfo: {
        isWifi: { type: Boolean },
        isMobile: { type: Boolean, },
        networkType: { type: String },
      },
      wifiInfo: {
        ssid: { type: String },
        bssid: { type: String },
        ipAddress: { type: String }
      },
      appVersion: { type: String, required: true }, // Uygulamanın sürüm numarası
      ipAddress: { type: String }, // Opsiyonel: Cihazın IP adresi
      downloadDate: { type: Date, default: Date.now }, // İndirilen tarih
      // TV cihazları için ek alanlar
      deviceBrand: { type: String }, // TV'nin markası (Samsung, LG vs.)
      osType: { type: String }, // TV'nin işletim sistemi (Tizen, WebOS, Android TV)
      screenSize: { type: String }, // TV'nin ekran boyutu (55 inches vs.)
      tvType: { type: String, enum: ['Smart TV', 'Android TV', 'Other'] }, // TV türü
      status:  { type: String, enum: ['start', 'finish'] } // download status
    }
  ],
  download_size: {
    type: Number, // Kullanıcının bu paket üzerinden yaptığı toplam yükleme miktarı Kullanımlar kb olarak ekleniyor.
    default: 0,
  },
  download_size_unit: {
    type: String, // Kullanıcının bu paket üzerinden yaptığı toplam yükleme miktarı Kullanımlar kb olarak ekleniyor.
    default: "kb",
  },
  createdAt: { type: Date, default: Date.now } // Oluşturulma tarihi
}, { timestamps: true });

module.exports = downloadSchema;