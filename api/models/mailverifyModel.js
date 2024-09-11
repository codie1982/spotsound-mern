const mongoose = require('mongoose');

// Oturum şeması tanımlama
const mailverifySchema = new mongoose.Schema({
  code: { type: Number, required: true },
  mail: { type: String },
  expireTime: { type: Number, default: 3600000 },
}, { timestamps: true });

// Model oluşturma
module.exports = mongoose.model('mailverify', mailverifySchema);;