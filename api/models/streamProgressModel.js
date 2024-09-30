const mongoose = require('mongoose');
var schema = require("../schema/streamProgressSchema")
module.exports = mongoose.model('streamProgress', schema);;