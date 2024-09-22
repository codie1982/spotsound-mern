const mongoose = require('mongoose');
var schema = require("../schema/playlistSchema")
module.exports = mongoose.model('playlists', schema);;