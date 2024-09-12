"use strict";

var mailModel = require("../models/mailModel");
module.exports = function saveMail(from, to, subject, text, info) {
  return new Promise(function (resolve, reject) {
    var mailDoc = new mailModel();
    mailDoc.messageinfo = info;
    mailDoc.from = from;
    mailDoc.to = to;
    mailDoc.subject = subject;
    mailDoc.text = text;
    mailDoc.save(function (err, result) {
      if (err) {
        console.log("err", err);
        reject(err);
      } else {
        if (result) {
          resolve(result);
        } else {
          resolve(null);
        }
      }
    });
  });
};