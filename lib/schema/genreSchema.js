"use strict";

var mongoose = require("mongoose");
var genreSchema = new mongoose.Schema({
  name: {
    type: String
  }
}, {
  timestamps: true
});
module.exports = genreSchema;