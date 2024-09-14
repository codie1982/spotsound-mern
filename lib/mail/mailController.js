"use strict";

var createdVerifyCode = require("../library/mail/createmailcode");
var transporter = require("./mailconfig");
var saveMail = require("../mail/maildb");
var mailVerifyDB = require("../mail/mailVerifydb");
var loginMail = function loginMail() {};
var mailVerify = function mailVerify(email) {
  return new Promise(function (resolve, reject) {
    createdVerifyCode().then(function (code) {
      mailVerifyDB.saveMailVerify(email, code).then(function () {
        var subject = "Mail Onayi";
        var text = "Mail Onay Kodunuz : ".concat(code);
        transporter.sendMail({
          from: process.env.MAIL_ADRESS,
          // Gönderici
          to: email,
          // Alıcı
          subject: subject,
          text: text
        }, function (error, info) {
          if (error) {
            reject(error);
          }
          saveMail(process.env.MAIL_ADRESS, email, subject, text, info).then(function (result) {
            resolve(result);
            if (info) console.log('Mail Onay Kodu Gönderildi: %s', info.messageId);
            if (result) console.log('Mesaj Kayıt edildi: %s', result);
          })["catch"](function (err) {
            console.log('Mesaj Kayıt edilemedi: %s', err);
          });
        });
      });
    });
  });
};
var aprovemail = function aprovemail() {
  return new Promise(function (resolve, reject) {
    createdVerifyCode().then(function (code) {
      mailVerifyDB.saveMailVerify(email, code).then(function () {
        var subject = "Mail Onayi";
        var text = "Mail Onay Kodunuz : ".concat(code);
        transporter.sendMail({
          from: process.env.MAIL_ADRESS,
          // Gönderici
          to: email,
          // Alıcı
          subject: subject,
          text: text
        }, function (error, info) {
          if (error) {
            reject(error);
          }
          saveMail(process.env.MAIL_ADRESS, email, subject, text, info).then(function (result) {
            resolve(result);
            if (info) console.log('Mail Onay Kodu Gönderildi: %s', info.messageId);
            if (result) console.log('Mesaj Kayıt edildi: %s', result);
          })["catch"](function (err) {
            console.log('Mesaj Kayıt edilemedi: %s', err);
          });
        });
      });
    });
  });
};
var supportMail = function supportMail(user, subject, text) {
  return new Promise(function (resolve, reject) {
    // Test mail gönderimi
    if (user.email_verify) {
      var recevier_email = user.email;
      transporter.sendMail({
        from: process.env.MAIL_ADRESS,
        // Gönderici
        to: recevier_email,
        // Alıcı
        subject: subject,
        text: text
      }, function (error, info) {
        if (error) {
          reject(error);
        }
        saveMail(process.env.MAIL_ADRESS, recevier_email, subject, text, info).then(function (result) {
          console.log('Mesaj Kayıt edildi: %s', info.messageId);
          console.log('Mesaj Kayıt edildi: %s', result);
        })["catch"](function (err) {
          console.log('Mesaj Kayıt edilemedi: %s', info.messageId);
        });
      });
    }
  });
};
module.exports = {
  loginMail: loginMail,
  mailVerify: mailVerify,
  supportMail: supportMail
};