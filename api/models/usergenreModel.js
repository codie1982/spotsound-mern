const mongoose = require('mongoose');
var schema = require("../schema/usergenreSchema")
module.exports = mongoose.model('usergenre', schema);;