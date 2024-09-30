const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ConnectionModel = require("../models/sessionModel");
const User = require("../models/userModel");
const Username = require("../models/usernameModel");
const Authorizate = require("../models/authorizationModel");
const usernameDb = require("../dbMap/username/usernameDb")
const userDbmap = require("../dbMap/users/usersDbmap")
const mailVerifyDbmap = require("../dbMap/mail/mailVerifyDbmap")

const mailController = require("../mail/mailController")
const isSingleWord = require("../library/user/isSingleWord")
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const getUserDataFromGoogle = require("./googleController");
const preparedata = require("../config/preparedata")
const CONSTANT = require("../constant/users/user_constant")
const connectionDbmap = require("../dbMap/connection/connectionDbmap")

const generateToken = require("../library/user/generate_token")
var geoip = require('geoip-lite');
//access private
//Mail kodu oluşturmak için
const verify = asyncHandler(async (req, res) => {
  const { email } = req.body
  try {
    const nUser = await userDbmap.getUserFromMail(email)
    if (nUser) {
      if (!nUser.email_verify) {
        mailController.mailVerify(email)
          .then((result) => {
            res.status(200).json(preparedata({ mail_verify_code: result.code, expire_time: result.expireTime }, 200, "mail kodu başarı ile gönderildi."));
          }).catch((err) => {
            res.status(200).json(preparedata({}, 200, "mail kodu gönderilmedi. Lütfen tekrar dneyiniz."));
          })
      } else {
        res.status(400).json(preparedata({}, 400, "mail adresi zaten onaylı"));
      }
    } else {
      res.status(404).json(preparedata({}, 404, "Kullanıcı maili bulunamadı."));
    }
  } catch (error) {
    res.status(400).json(preparedata(error, 400, "mail verify error"));
  }
});

//Mail kodu Onaylamak için
const aprove = asyncHandler(async (req, res) => {
  const { code, setconnection } = req.body;
  const _setConnectioon = setconnection != null ? setconnection : false
  const userAgent = req.headers["user-agent"]; // Kullanıcı ajanı (tarayıcı bilgisi)
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; // Kullanıcının IP adresi
  const sessionid = req.sessionID;
  if (!code) {
    res.status(400);
    throw new Error("there is no mail verify code");
  }
  try {
    const _code = new Number(code)
    const isVerify = await mailVerifyDbmap.isApprove(parseInt(_code))
    if (isVerify) {
      const userEmail = await mailVerifyDbmap.getMailFromCode(parseInt(_code))
      const nUser = await userDbmap.getUserFromMail(userEmail)
      if (nUser) {
        const userid = nUser._id
        await userDbmap.setVerifyMail(userid)
        if (_setConnectioon) {
          const userToken = generateToken(userid);
          const geo = geoip.lookup(ip);
          await connectionDbmap.saveConnection(geo, ip, userAgent, "desktop", "web", sessionid, userToken, userid);
          req.session.user = {
            name: nUser.firstname, image: nUser.profileImage.path, token: userToken,
            lang: geo != null ? geo.country == "TR" ? "TR" : "EN" : "TR"
          }
          res.status(200).json(preparedata({
            name: nUser.name,
            email: nUser.email,
            email_verify: nUser.email_verify,
            token: userToken,
          }, 200, "mail is verifyed"));
        } else {
          res.status(200).json(preparedata({
            name: nUser.name,
            email: nUser.email,
            email_verify: nUser.email_verify,
          }, 200, "mail is verifyed"));
        }
      }
    } else {
      res.status(400).json(preparedata({}, 400, "mail verify code is not approved"));
    }
  } catch (error) {
    res.status(400).json(preparedata(error, 400, "mail verify error"));
  }
});


module.exports = {
  aprove, verify
};
