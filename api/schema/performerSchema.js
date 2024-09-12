const mongoose = require("mongoose");
const imageSchema = require("../schema/imageSchema")
const performerSchema = new mongoose.Schema({
  name: { type: String },
  bio: { type: String },
  birthdate: { type: Date, default: new Date() },
  profileImage: { type: imageSchema, default: () => ({}) },  // Varsayılan değer olarak boş bir obje döner,
  socialLinks: {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String }
  },
}, { timestamps: true });

module.exports = performerSchema;