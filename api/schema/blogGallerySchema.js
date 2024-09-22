const mongoose = require("mongoose");
const imageSchema = require("./imageSchema")
const blogGallerySchema = new mongoose.Schema({
  userid: { type: String }, // Blog galerisini oluşturan kullanıcı
  blogid: { type: String },  // Blog'a ait ID
  gallery: [
    {
      line: { type: Number },
      createdDate: { type: Date },
      image: imageSchema,
      active: { type: Boolean, default: false }
    }
  ],
}, { timestamps: true });

module.exports = blogGallerySchema;