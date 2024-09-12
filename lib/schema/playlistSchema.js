"use strict";

var mongoose = require("mongoose");
var playlistSchema = new mongoose.Schema({
  name: {
    type: String
  }
}, {
  timestamps: true
});
module.exports = playlistSchema;