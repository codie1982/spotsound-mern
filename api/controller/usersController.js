const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ConnectionModel = require("../models/connectionModel");
const User = require("../models/userModel");
const Username = require("../models/usernameModel");
const Authorizate = require("../models/authorizationModel");
const usernameDb = require("../dbMap/username/usernameDb")
const userDbmap = require("../dbMap/users/usersDbmap")
const mailVerifyDbmap = require("../dbMap/mail/mailVerifyDbmap")
const generateToken = require("../library/user/generate_token")
const mailController = require("../mail/mailController")
const isSingleWord = require("../library/user/isSingleWord")
const { OAuth2Client } = require("google-auth-library");
const getUserDataFromGoogle = require("./googleController");
const preparedata = require("../config/preparedata")
const CONSTANT = require("../constant/users/user_constant")
var geoip = require('geoip-lite');
const connectionDbmap = require("../dbMap/connection/connectionDbmap")
const SCOPE = "https://www.googleapis.com/auth/userinfo.profile email openid"
const redirecServertUrl = process.env.NODE_ENV == "development" ? "http://127.0.0.1:5001" : "https://" + process.env.REDIRECT_SERVER_URL + "/api/users/oauth";
const redirecUrl = process.env.NODE_ENV == "development" ? "http://127.0.0.1:3000" : "https://" + process.env.REDIRECT_URL;
const allow_origin_url = process.env.NODE_ENV == "development" ? "http://localhost:3000" : "https://" + process.env.ALLOW_ORJIN_URL;
//access private
const getMe = asyncHandler(async (req, res) => {
  const { name, email, profileImage } = await userDbmap.getUserInfo(req.user._id)
  try {
    var data = { name, email, image: profileImage.path, }
    res.status(200)
      .json(preparedata(data, 200, "Connection Status"))
  } catch (error) {
    console.error("Error reading data:", error);
  }
});
//access public
const register = asyncHandler(async (req, res) => {
  const { firstname, lastname, username, email, device, provider, password } = req.body;
  if (provider == CONSTANT.EMAIL) {
    const userAgent = req.headers["user-agent"]; // Kullanıcı ajanı (tarayıcı bilgisi)
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; // Kullanıcının IP adresi

    if (!username || !email || !password) {
      res.status(400).json(preparedata({}, 400, "Please add all fields"))
    }
    if (!isSingleWord(username)) {
      res.status(400).json(preparedata({}, 400, "Kullanıcı adı tek kelime olmalı"))
    }
    //check Email
    const isUserExist = await userDbmap.isUserFromEmail(email);
    if (isUserExist) {
      res.status(400).json(preparedata({}, 400, "User Already register"));
    }
    //check Username
    const isUserNameExist = await usernameDb.find(username);
    if (isUserNameExist) {
      res.status(400).json(preparedata(null, 400, "Username Already Exist"));
    }
    //Create Use
    const doc = new User();
    doc.password = await makepassword(password);
    doc.firstname = firstname;
    doc.lastname = lastname;
    doc.email = email;
    doc.appType = device;
    doc.authProvider = provider
    const mUser = await doc.save()
    if (mUser) {
      const userid = mUser._id
      const newUsername = new Username({
        userid, // Bu bir ObjectId olmalı (mevcut kullanıcı ID'si)
        usernames: [
          {
            username: username, // Kullanıcı adı buraya eklenir
          }
        ]
      });
      // Kaydı kaydetme
      await newUsername.save();

      const newAuth = new Authorizate({
        userid, // Bu bir ObjectId olmalı (mevcut kullanıcı ID'si)
      })
      //Kullanıcıyı kayıt et

      await newAuth.save()
      //Onay maili gönder
      mailController.mailVerify(email)
        .then((code) => {
          res.status(201).json(preparedata({}, 201, "Kaydınız başarı ile yapıldı. Lütfen mail onay Kodunu gönderiniz."));
        }).catch((err) => {
          res.status(201).json(preparedata({}, 201, "Kaydınız başarı ile yapıldı. Lütfen mail onay Kodunu gönderiniz."));
        })
    } else {
      provider
      res.status(400);
      throw new Error("InValied DB User ERROR");
    }

  } else {
    res.status(400);
    throw new Error("InValied User data");
  }
});
//access public
const registerWithGoogle = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin", allow_origin_url);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Referrer-Policy", "no-referrer-when-downgrade");


  console.log("process.env.CLIENT_ID", process.env.CLIENT_ID)
  console.log("process.env.CLIENT_SECRET", process.env.CLIENT_SECRET)
  console.log("redirecServertUrl", redirecServertUrl)
  console.log("SCOPE", SCOPE)
  const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirecServertUrl
  );
  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPE,
    prompt: "consent",
  });
  if (url) {
    res.status(200).json({
      status: {
        code: 200,
        description: "google authentication url"
      },
      message: "google authentication url",
      data: { url }
    });
  } else {
    res.status(400).json({
      status: {
        code: 400,
        description: "no google url"
      },
      message: "there is no google authentication url",
      data: null
    });
  }
});

const googleOAuth = asyncHandler(async (req, res) => {
  var selectedUserid,
    selectedUsername,
    selectedUserProfilImage,
    selectedUseremail = "";
  const code = req.query.code;
  try {
    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirecServertUrl
    );
    const ut = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(ut.tokens);
    const user = oAuth2Client.credentials;
    const googleData = await getUserDataFromGoogle(user.access_token);
    const {
      sub,
      name,
      given_name,
      family_name,
      picture,
      email,
      email_verified,
    } = googleData;
    //checkUsers
    const userExist = await userDbmap.isUserFromEmail(email);
    if (!userExist) {
      const doc = new User();
      doc.firstname = given_name;
      doc.lastname = family_name;
      doc.email = email;
      doc.email_verify = email_verified;
      doc.profileImage.type = "external";
      doc.profileImage.path = picture;
      doc.appType = "web";
      doc.authProvider = "google";
      doc.authProviderID = sub;
      const mUser = await userDbmap.add(doc)
      if (!mUser) {
        res.status(400);
        throw new Error("InValied User data");
      }
      selectedUserid = nUser["id"];
      selectedUsername = googleData.name;
      selectedUserProfilImage = googleData.picture

    } else {
      selectedUserid = userExist["_id"];
      selectedUsername = userExist["name"];
      selectedUserProfilImage = userExist.profileImage.path
    }

    //Kullanıcı Oturumu Açma
    // Cihaz bilgilerini al
    const userAgent = req.headers["user-agent"]; // Kullanıcı ajanı (tarayıcı bilgisi)
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; // Kullanıcının IP adresi
    const sessionid = req.sessionID;
    const connectionModel = await ConnectionModel.findOne({ sessionid });

    if (!connectionModel) {
      var geo = geoip.lookup(ip);
      const userToken = generateToken(selectedUserid);
      const nConnection = await connectionDbmap.saveConnection(geo, ip, userAgent, "desktop", "web", sessionid, userToken, selectedUserid);
      //Mail gönderimi yapıp gönderdiğimiz maili de DBye yazmak gerekli
      if (nConnection) {
        req.session.user = {
          name: selectedUsername, image: selectedUserProfilImage, token: userToken,
          lang: geo != null ? geo.country == "TR" ? "TR" : "EN" : "TR"
        };
        res.redirect(`${redirecUrl}/oauth?token=${userToken}`);
      } else {
        res.redirect("https://www.spotsoundmusic.com");
      }

    } else {
      const userToken = connectionModel.token;
      req.session.user = {
        name: selectedUsername, image: selectedUserProfilImage, token: userToken,
        lang: geo != null ? geo.country == "TR" ? "TR" : "EN" : "TR"
      };
      res.redirect(`${process.env.REDIRECT_URL}?token=${userToken}`);
    }

  } catch (error) {
    console.log("error", error);
  }
});
//access private
const logout = asyncHandler(async (req, res) => {
  try {
    delete req.session['user']
    req.session.destroy(function (err) {
      res.status(200).json(preparedata(null, 200, "user logout successful!"));
    });
  } catch (error) {
    console.error("Error reading data:", error);
  }
});
//access public
const login = asyncHandler(async (req, res) => {
  const userAgent = req.headers["user-agent"]; // Kullanıcı ajanı (tarayıcı bilgisi)
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; // Kullanıcının IP adresi
  const sessionid = req.sessionID;
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("there is no email or password");
  }
  try {
    const user = await userDbmap.getUserFromMail(email);
    const userid = user._id;
    if (user || bcrypt.compare(password, user.password)) {
      const userToken = generateToken(userid);
      const geo = geoip.lookup(ip);
      await connectionDbmap.saveConnection(geo, ip, userAgent, "desktop", "web", sessionid, userToken, userid);
      req.session.user = {
        name: user.firstname, image: user.profileImage.path, token: userToken,
        lang: geo != null ? geo.country == "TR" ? "TR" : "EN" : "TR"
      }
      delete user._id
      delete user.profileImage._id
      res.status(200).json(preparedata({
        ...user,
        token: userToken,
      }, 200, "user is login success"));
    } else {
      res.status(400);
      throw new Error("inValide credental");
    }
  } catch (error) {
    console.error("Error reading data:", error);
  }
});

const makepassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword
}


module.exports = {
  getMe,
  login,
  register,
  registerWithGoogle,
  logout,
  googleOAuth,
};
