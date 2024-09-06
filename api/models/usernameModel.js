const mongoose = require("mongoose");

const usernameSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, require: true },
  usernames: [
    {
      name: { type: String, },
      createdAt: { type: Date, default: Date.now }, // Oturumun başlatıldığı zaman
    }
  ],
});

module.exports = mongoose.model("usernames", usernameSchema);