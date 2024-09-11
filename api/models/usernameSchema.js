const mongoose = require("mongoose");

const usernameSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, require: true },
  usernames: [
    {
      username:  { type: String, required: [true, "Please add a username"] },
      createdAt: { type: Date, default: Date.now }, // Oturumun başlatıldığı zaman
    }
  ],
});

module.exports = usernameSchema;