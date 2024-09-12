"use strict";

var mongoose = require('mongoose');
var authorizationSchema = require("../schema/authorizationSchema");

// Model oluşturma
module.exports = mongoose.model('authorization', authorizationSchema);
;