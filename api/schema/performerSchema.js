const mongoose = require("mongoose");
const imageSchema = require("../schema/imageSchema")
const performerSchema = new mongoose.Schema({
  name: { type: String },
  sortname: { type: String },
  bio: { type: String },
  birthdate: { type: Date, default: new Date() },
  gender: { type: String },
  country: { type: String },
  profileImage: { type: imageSchema, default: () => ({}) },  // Varsayılan değer olarak boş bir obje döner,
  addedby: { type: mongoose.Schema.Types.ObjectId, default: null },
  socialLinks: {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String }
  },
}, { timestamps: true });

module.exports = performerSchema;