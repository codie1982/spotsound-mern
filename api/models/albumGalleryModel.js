const mongoose = require("mongoose");
const schema = require("../schema/albumGallerySchema");
module.exports = mongoose.model("albumsgallery", schema);