const mongoose = require('mongoose');
var schema = require("../schema/performerSchema")
module.exports = mongoose.model('performers', schema);;