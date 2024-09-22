const mongoose = require('mongoose');
var schema = require("../schema/offlineSchema")
module.exports = mongoose.model('offline', schema);