const mongoose = require('mongoose');

// Oturum şeması tanımlama
const authorizationSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Kullanıcı ID'si
  role: { type: String, default: "user" },
  authorities: { type: Array, default: [] }
});

// Model oluşturma
module.exports = authorizationSchema