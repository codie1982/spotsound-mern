const mongoose = require('mongoose');

const offlineSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Kullanıcı referansı
    required: true
  },
  offlineType: {
    type: String,
    enum: ['album', 'performer', 'song'], // İndirilen içerik türleri
    required: true
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album', // Albüm referansı
    required: function () {
      return this.offlineType === 'album';
    }
  },
  performer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Performer', // Performans sanatçısı referansı
    required: function () {
      return this.offlineType === 'performer';
    }
  },
  song: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song', // Şarkı referansı
    required: function () {
      return this.offlineType === 'song';
    }
  },
  downloadedAt: {
    type: Date,
    default: Date.now // İndirilme tarihi
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now // Son erişim tarihi (kullanıcı bu içeriği en son ne zaman açtı)
  },
  storagePath: {
    type: String, // Cihazda indirilen dosyanın depolandığı yer
    required: true
  },
  isAvailableOffline: {
    type: Boolean,
    default: true // İndirilmiş içerik varsayılan olarak offline modda kullanılabilir durumda olur
  }
}, { timestamps: true });

module.exports = offlineSchema
