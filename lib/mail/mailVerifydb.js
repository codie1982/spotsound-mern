"use strict";

var mailVerifyModel = require("../models/mailverifyModel");
function saveMailVerify(email, code) {
  return new Promise(function (resolve, reject) {
    var mailVerifyDoc = new mailVerifyModel();
    mailVerifyDoc.code = code;
    mailVerifyDoc.mail = email;
    mailVerifyDoc.save(function (err, result) {
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
}
module.exports = {
  saveMailVerify: saveMailVerify
};