const mongoose = require('mongoose');
var authorizationSchema = require("../schema/authorizationSchema")
module.exports = mongoose.model('authorization', authorizationSchema);;