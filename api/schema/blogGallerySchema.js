const mongoose = require("mongoose");
const imageSchema = require("./imageSchema")
const blogGallerySchema = new mongoose.Schema({
  userid: { type: String }, // Blog galerisini oluşturan kullanıcı
  blogid: { type: String },  // Blog'a ait ID
  images: [
    imageSchema // Galeride yer alan resimlerin listesi
  ],
}, { timestamps: true });

module.exports = blogGallerySchema;