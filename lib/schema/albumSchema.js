"use strict";

var mongoose = require("mongoose");
var albumSchema = new mongoose.Schema({
  password: {
    type: String
  }
}, {
  timestamps: true
});
module.exports = albumSchema;