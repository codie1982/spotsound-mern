const mongoose = require("mongoose");
const schema = require("../schema/blogGallerySchema");
module.exports = mongoose.model("bloggallery", schema);