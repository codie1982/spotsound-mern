const mongoose = require('mongoose');
var schema = require("../schema/performerGallerySchema")
module.exports = mongoose.model('performer_gallery', schema);;