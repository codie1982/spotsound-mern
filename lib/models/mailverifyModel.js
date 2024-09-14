"use strict";

var mongoose = require('mongoose');

// Oturum şeması tanımlama
var mailverifySchema = new mongoose.Schema({
  code: {
    type: Number,
    required: true
  },
  mail: {
    type: String
  },
  expireTime: {
    type: Number,
    "default": 3600000
  }
}, {
  timestamps: true
});

// Model oluşturma
module.exports = mongoose.model('mailverify', mailverifySchema);
;