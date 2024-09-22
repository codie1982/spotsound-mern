const mongoose = require('mongoose');
var schema = require("../schema/genreSchema")
module.exports = mongoose.model('genre', schema);;