"use strict";

module.exports = function createdVerifyCode() {
  return new Promise(function (resolve, reject) {
    var code = process.env.NODE_ENV == "development" ? new Number(999999) : new Number(999999);
    resolve(code);
  });
};