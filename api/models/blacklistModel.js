const mongoose = require('mongoose');
var schema = require("../schema/blacklistSchema")
module.exports = mongoose.model('blacklist', schema);;