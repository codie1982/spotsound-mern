const mongoose = require('mongoose');

const streamProgressSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  songid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'songs',
    required: true
  },
  streamuuid: {
    type: String,
    required: true
  },
  currentPosition: {
    type: Number, // Saniye cinsinden kaydedilen yer
    default: 0
  },
  totalDuration: {
    type: Number // Şarkının veya videonun toplam süresi (saniye)
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = streamProgressSchema;