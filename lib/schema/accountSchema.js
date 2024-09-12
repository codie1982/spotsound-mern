"use strict";

var mongoose = require("mongoose");
var accountSchema = new mongoose.Schema({
  name: {
    type: String
  }
}, {
  timestamps: true
});
module.exports = accountSchema;