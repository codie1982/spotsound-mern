"use strict";

var mongoose = require("mongoose");
var podcastSchema = new mongoose.Schema({
  password: {
    type: String
  }
}, {
  timestamps: true
});
module.exports = podcastSchema;