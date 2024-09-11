const mongoose = require('mongoose');

var authorizationSchema = require("./authorizationSchema")

// Model oluşturma
module.exports = mongoose.model('authorization', authorizationSchema);;