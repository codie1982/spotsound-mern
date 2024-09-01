const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ConnectionModel = require("../models/connectionModel");
const jwt = require("jsonwebtoken");
var geoip = require('geoip-lite');
const checkConnection = asyncHandler(async (req, res) => {
  if (req.session.usr) {
    const name = req.session.user.name
    const image = req.session.user.image
    const token = req.session.user.token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded) {
      res.status(200).json({
        status: {
          code: 400,
          description: "No Connection"
        },
        message:"No Connection",
        data: {
          name,image, token
        }
      })
    } else {
      res.status(400).json({
        status: {
          code: 400,
          description: "No Connection"
        },
        message:"No Connection",
        data: {}
      })
    }

  } else {
    res.status(400).json({
      status: {
        code: 400,
        description: "No Connection"
      },
      data: {}
    })
  }
});

const connectionLanguage = asyncHandler(async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; // Kullanıcının IP adresi
  //var ip = "83.66.162.84"; //Türkiye IP'si
  //var ip = "207.97.227.239"; // Amerika IP
  var geo = geoip.lookup(ip);
  console.log("geo",ip,geo)
  req.session.cookie.lang = geo != null ? geo.country == "TR" ? "TR" : "EN" : "TR"
  console.log("req.session",req.session)
  res.status(200).json({
    status: {
      code: 400,
      description: "No Connection"
    },
    message:"No Connection",
    data: {lang: geo != null ? geo.country == "TR" ? "TR" : "EN" : "TR"}
  })
});

module.exports = {
  checkConnection,connectionLanguage
};
