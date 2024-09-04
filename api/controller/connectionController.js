const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ConnectionModel = require("../models/connectionModel");
const jwt = require("jsonwebtoken");
var geoip = require('geoip-lite');
const checkConnection = asyncHandler(async (req, res) => {
  if (req.session.user) {
    const token = req.session.user.token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded) {
      res.status(200).json({
        status: {
          code: 200,
          description: "Connection Status"
        },
        message: "Connection Status",
        data: {
           token
        }
      })
    } else {
      res.status(200).json({
        status: {
          code: 200,
          description: "No Connection"
        },
        message: "No Connection",
        data: null
      })
    }

  } else {
    res.status(200).json({
      status: {
        code: 200,
        description: "No Connection"
      },
      data: null
    })
  }
});

const connectionLanguage = asyncHandler(async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; // Kullanıcının IP adresi
  //var ip = "83.66.162.84"; //Türkiye IP'si
  //var ip = "207.97.227.239"; // Amerika IP
  var geo = geoip.lookup(ip);
  res.status(200).json({
    status: {
      code: 200,
      description: "No Connection"
    },
    message: "No Connection",
    data: { lang: geo != null ? geo.country == "TR" ? "TR" : "EN" : "TR" }
  })
});

module.exports = {
  checkConnection, connectionLanguage
};
