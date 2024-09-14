"use strict";

var mongoose = require("mongoose");
var performerSchema = new mongoose.Schema({
  name: {
    type: String
  }
}, {
  timestamps: true
});
module.exports = performerSchema;