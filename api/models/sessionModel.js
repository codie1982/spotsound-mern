const mongoose = require('mongoose');

// Oturum şeması tanımlama
const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Kullanıcı ID'si
  sessionToken: { type: String, required: true, unique: true }, // Oturum token'ı
  ipAddress: { type: String }, // Kullanıcının oturum açtığı IP adresi
  userAgent: { type: String }, // Kullanıcının cihaz bilgisi
  deviceType: { type: String, enum: ['desktop', 'mobile', 'tablet'], required: true }, // Cihaz türü
  appType: { type: String, enum: ['web', 'mobileApp'], required: true }, // Oturumun hangi uygulamadan yapıldığı
  createdAt: { type: Date, default: Date.now }, // Oturumun başlatıldığı zaman
  expiresAt: { type: Date, required: true }, // Oturumun sona ereceği zaman
  lastAccessedAt: { type: Date, default: Date.now } // Oturumun en son erişildiği zaman
});

// Model oluşturma
const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;