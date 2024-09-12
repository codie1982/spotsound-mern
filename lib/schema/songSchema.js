"use strict";

var mongoose = require("mongoose");
var songSchema = new mongoose.Schema({
  name: {
    type: String
  }
}, {
  timestamps: true
});
module.exports = songSchema;