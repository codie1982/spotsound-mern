"use strict";

//Generete Token
var jwt = require("jsonwebtoken");
module.exports = function generateToken(id) {
  return jwt.sign({
    id: id
  }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
};