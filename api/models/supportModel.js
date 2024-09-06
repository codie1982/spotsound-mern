const mongoose = require('mongoose');

// Oturum şeması tanımlama
const supportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Kullanıcı ID'si
  subject: { type: String, }, // Kullanıcı ID'si
  description: {
    type: String, maxlength: 1024
  },
  solved: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
  active: { type: Boolean, default: true }
}, { timestamps: true });

// Model oluşturma
module.exports = mongoose.model('support', supportSchema);;