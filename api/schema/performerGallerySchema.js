const mongoose = require("mongoose");
const imageSchema = require("./imageSchema")
const performerGallerySchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId },
  performerid: { type: mongoose.Schema.Types.ObjectId },
  images: [
    imageSchema
  ],
}, { timestamps: true });

module.exports = performerGallerySchema;