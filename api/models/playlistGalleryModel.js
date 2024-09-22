const mongoose = require('mongoose');
var schema = require("../schema/playlistGallerySchema")
module.exports = mongoose.model('playlist_gallery', schema);;