const mongoose = require('mongoose');

// Oturum şeması tanımlama
const mailSchema = new mongoose.Schema({
  messageinfo: { type: mongoose.Schema.Types.Mixed },
  from: { type: String, required: true },
  to: { type: String, required: true },
  subject: { type: String, required: true },
  text: { type: String, required: true },
}, { timestamps: true });

// Model oluşturma
module.exports = mongoose.model('mail', mailSchema);;