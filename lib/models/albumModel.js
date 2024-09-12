"use strict";

var mongoose = require("mongoose");
var albumSchema = require("../schema/albumSchema");
module.exports = mongoose.model("albums", albumSchema);