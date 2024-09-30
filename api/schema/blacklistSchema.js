const mongoose = require("mongoose");

// Oturum şeması tanımlama
const blacklistSchema = new mongoose.Schema({
  token: { type: String, required: true }, // Geçersiz kılınan token
  expiresAt: { type: Date, required: true } // Token'ın süresinin dolma tarihi
});


module.exports = blacklistSchema;