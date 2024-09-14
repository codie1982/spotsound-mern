"use strict";

var mongoose = require("mongoose");
var usernameModel = require("../schema/usernameSchema");
module.exports = mongoose.model("username", usernameModel);