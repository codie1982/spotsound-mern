const mongoose = require("mongoose");
const imageSchema = require("./imageSchema")
const performerGallerySchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId },
  performerid: { type: mongoose.Schema.Types.ObjectId },
  profil: [
    {
      line: { type: Number },
      createdDate: { type: Date },
      image: imageSchema,
      active: { type: Boolean, default: false }
    }
  ],
  cover: [
    {
      line: { type: Number },
      createdDate: { type: Date },
      image: imageSchema,
      active: { type: Boolean, default: false }
    }
  ],
  gallery: [
    {
      line: { type: Number },
      createdDate: { type: Date },
      image: imageSchema,
      active: { type: Boolean, default: false }
    }
  ],
}, { timestamps: true });

module.exports = performerGallerySchema;