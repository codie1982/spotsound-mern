const mongoose = require('mongoose');
var schema = require("../schema/downloadSchema")
module.exports = mongoose.model('authorization', schema);;