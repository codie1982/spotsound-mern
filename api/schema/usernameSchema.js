const mongoose = require("mongoose");

const usernameSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, require: true },
  username: { type: String, required: [true, "Please add a username"] },
}, { timestamps: true });

module.exports = usernameSchema;