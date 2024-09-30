const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ConnectionModel = require("../models/sessionModel");
const jwt = require("jsonwebtoken");
var geoip = require('geoip-lite');
const preparedata = require("../config/preparedata")
const checkConnection = asyncHandler(async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; // Kullanıcının IP adresi
  //var ip = "83.66.162.84"; //Türkiye IP'si
  //var ip = "207.97.227.239"; // Amerika IP
  var geo = geoip.lookup(ip);
  var language = { lang: geo != null ? geo.country == "TR" ? "TR" : "EN" : "TR" }
  if (req.session.user) {

    const token = req.session.user.token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded) {
      res.status(200).json(preparedata({ token, language }, 200, "Connection Status"))
    } else {
      res.status(200).json(preparedata({ language }, 200, "No Connection"))
    }
  } else {
    res.status(200).json(preparedata({ language }, 200, "No Connection"))
  }
});

const connectionLanguage = asyncHandler(async (req, res) => {
  //const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; // Kullanıcının IP adresi
  //var ip = "83.66.162.84"; //Türkiye IP'si
  var ip = "207.97.227.239"; // Amerika IP
  var geo = geoip.lookup(ip);
  console.log("geo",geo)
  var data = { lang: geo != null ? geo.country == "TR" ? "TR" : "EN" : "TR" }
  res.status(200).json(preparedata(data, 200, "No Connection"))
});
//

module.exports = {
  checkConnection, connectionLanguage
};
