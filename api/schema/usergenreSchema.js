const mongoose = require('mongoose');

const userGenreSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Kullanıcı referansı
    required: true
  },
  genreid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre', // Genre (Müzik türü) referansı
    required: true
  },
  preferenceLevel: {
    type: Number,
    min: 1,
    max: 5,
    default: 3, // 1 düşük, 5 yüksek ilgi seviyesi gibi
    required: true
  },
  favorite: {
    type: Boolean,
    default: false // Kullanıcı favorisi olup olmadığını belirler
  },
  addedDate: {
    type: Date,
    default: Date.now // Kullanıcı tarafından eklenme zamanı
  }
}, { timestamps: true });

module.exports = userGenreSchema;
