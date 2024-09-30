const mongoose = require('mongoose');
var schema = require("../schema/sessionSchema")
module.exports = mongoose.model('session', schema);;