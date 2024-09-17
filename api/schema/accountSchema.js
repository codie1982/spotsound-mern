const mongoose = require("mongoose");
const accountSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Kullanıcı referansı
    required: true
  },
  packages: [{
    packageid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'package', // İlişkili olduğu Package koleksiyonuna referans
      required: true
    },
    subscribeid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'subscribe', // İlişkili olduğu Package koleksiyonuna referans
    },
    masteruserid: {
      type: mongoose.Schema.Types.ObjectId, // master user paketi satın alan ve paylaşıma açan kişi. eğer master ise kullanıcı 
      trim: true
    },
    sharedWith: [{
      userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Paketi kullanan diğer kullanıcılar
      },
      downloadLimit: {
        type: Number, // Paylaşılan indirme hakkı
        min: 0
      },
      uploadLimit: {
        type: Number, // Paylaşılan yükleme hakkı
        min: 0
      }
    }],
    isActive: {
      type: Boolean,
      default: true // Paket geçerli mi, süre dolduğunda false olabilir
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
  }]
}, { timestamps: true });

module.exports = accountSchema;