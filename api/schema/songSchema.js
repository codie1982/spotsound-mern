const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  name: { type: String },
  uploadid: { type: String, required: true },
  downloadble: { type: Boolean },
  streamble: { type: Boolean },
  genre: { type: mongoose.Schema.Types.ObjectId, ref: "genre" },
  raiting: { type: Number },
  count: { type: Number },
  like: { type: Number },
  hasLyrics: { type: Boolean, default: false },
  
  // Şarkı özellikleri (Meta veriler)
  metadata: {
    duration: { type: Number }, // Şarkının süresi (saniye cinsinden)
    bitrate: { type: String }, // Bitrate bilgisi (örnek: "320kbps")
    format: { type: String }, // Dosya formatı (örnek: "mp3", "flac")
    fileSize: { type: Number }, // Dosya boyutu (örneğin, byte cinsinden)
    sampleRate: { type: Number }, // Örnekleme hızı (örneğin, "44100 Hz")
    channels: { type: String, enum: ["mono", "stereo"] }, // Mono veya Stereo
  },

  // Telif hakları ile ilgili alanlar
  copyrightOwnedByUser: { type: Boolean, default: false }, // Telif hakkı kullanıcıya ait mi?
  canBeShared: { type: Boolean, default: function() {
    return this.copyrightOwnedByUser; // Telif hakkı kullanıcıya aitse paylaşılabilir
  }},

  // Telif hakkı ile ilgili diğer bilgiler
  copyrightInfo: {
    owner: { type: String }, // Telif hakkı sahibi (eğer kullanıcı değilse)
    licenseType: { type: String }, // Telif lisansı türü (örneğin "Creative Commons", "All Rights Reserved")
    expirationDate: { type: Date } // Telif hakkı süresi dolma tarihi (varsa)
  }
}, { timestamps: true });

module.exports = songSchema;