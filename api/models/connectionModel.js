const mongoose = require('mongoose');

// Oturum şeması tanımlama
const connectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Kullanıcı ID'si
  token:{ type: String, required: true }, // Kullanıcı Token
  sessionid: { type: String, required: true, unique: true }, // SessionID'ı
  ipAddress: { type: String }, // Kullanıcının oturum açtığı IP adresi
  userAgent: { type: String }, // Kullanıcının cihaz bilgisi
  deviceType: { type: String, enum: ['desktop', 'mobile', 'tablet'], required: true }, // Cihaz türü
  appType: { type: String, enum: ['web', 'mobileApp'], required: true }, // Oturumun hangi uygulamadan yapıldığı
  createdAt: { type: Date, default: Date.now }, // Oturumun başlatıldığı zaman
  lastAccessedAt: { type: Date, default: Date.now } // Oturumun en son erişildiği zaman
});

// Model oluşturma
module.exports = mongoose.model('connection', connectionSchema);;