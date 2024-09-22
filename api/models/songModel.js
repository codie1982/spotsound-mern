const mongoose = require('mongoose');
var schema = require("../schema/songSchema")
module.exports = mongoose.model('songs', schema);;