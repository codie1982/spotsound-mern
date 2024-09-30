const mongoose = require("mongoose");
const imageSchema = require("../schema/imageSchema")
const performerSchema = new mongoose.Schema({
  name: { type: String },
  sortname: { type: String },
  bio: { type: String },
  birthdate: { type: Date, default: new Date() },
  gender: { type: String },
  country: { type: String },
  genres: [{ type: mongoose.Schema.Types.ObjectId }],
  addedby: { type: mongoose.Schema.Types.ObjectId, default: null },
  socialLinks: {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String }
  },
  songs: [
    { songid: { type: mongoose.Schema.Types.ObjectId } }
  ],
  performer_delete: { type: Boolean, default: false },
  performer_active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = performerSchema;