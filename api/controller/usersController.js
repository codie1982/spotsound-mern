const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ConnectionModel = require("../models/connectionModel");
const User = require("../models/userModel");
const userDb = require("../controller/users/usersDb")
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const getUserDataFromGoogle = require("./googleController");
const preparedata = require("../config/preparedata")
var geoip = require('geoip-lite');
//access private
const getMe = asyncHandler(async (req, res) => {

  const { _id, name, email, profileImage } = await userDb.getUserInfo(req.user._id)
  try {
    var data = { name, email, image: profileImage.path, }
    res.status(200)
      .json(preparedata(data, 200, "Connection Status"))
  } catch (error) {
    console.error("Error reading data:", error);
  }
});

//access public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  //checkUsers
  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("User Already register");
  }
  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  //Create User
  const doc = new User();
  doc.name = name;
  doc.email = email;
  doc.password = hashedPassword;
  const nUser = await doc.save(doc);
  if (nUser) {
    res.status(201).json({
      _id: nUser._id,
      name: nUser.name,
      email: nUser.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("InValied User data");
  }
});
//access public
const registerWithGoogle = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Referrer-Policy", "no-referrer-when-downgrade");


  const redirectUrl = "http://127.0.0.1:5001/api/users/oauth";
  const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirectUrl
  );
  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/userinfo.profile email openid ",
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
    const redirectUrl = "http://127.0.0.1:5001/api/users/oauth";
    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectUrl
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
    /**
         * {
            sub: '105113479171269382757',
            name: 'Engin EROL',
            given_name: 'Engin',
            family_name: 'EROL',
            picture: 'https://lh3.googleusercontent.com/a/ACg8ocK5AcLNndhbXFi8sdw_mo3b3EgkfRZgOOfS77dffHPVj56OswzN=s96-c',
            email: 'granitjeofizik@gmail.com',
            email_verified: true
            }
         */
    //checkUsers
    const userExist = await User.findOne({ email });

    if (!userExist) {
      const nUser = await saveUserByGoogle(sub, name, given_name, family_name, picture, email, email_verified);
      if (!nUser) {
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
      const nConnection = await saveConnection(geo, ip, userAgent, "desktop", "web", sessionid, userToken, selectedUserid);
      //Mail gönderimi yapıp gönderdiğimiz maili de DBye yazmak gerekli
      if (nConnection) {
        req.session.user = {
          name: selectedUsername, image: selectedUserProfilImage, token: userToken,
          lang: geo != null ? geo.country == "TR" ? "TR" : "EN" : "TR"
        };
        res.redirect(`http://127.0.0.1:3000/oauth?token=${userToken}`);
      } else {
        res.redirect("http://127.0.0.1:3000/404");
      }

    } else {
      const userToken = connectionModel.token;
      req.session.user = {
        name: selectedUsername, image: selectedUserProfilImage, token: userToken,
        lang: geo != null ? geo.country == "TR" ? "TR" : "EN" : "TR"
      };
      res.redirect(`http://127.0.0.1:3000/oauth?token=${userToken}`);
    }

  } catch (error) {
    console.log("error", error);
  }
});

const saveUserByGoogle = (sub, name, given_name, family_name, picture, email, email_verified) => {
  return new Promise((resolve, reject) => {
    const doc = new User();
    doc.name = name;
    doc.firstname = given_name;
    doc.lastname = family_name;
    doc.email = email;
    doc.email_verify = email_verified;
    doc.profileImage.type = "external";
    doc.profileImage.path = picture;
    doc.appType = "web";
    doc.authProvider = "google";
    doc.authProviderID = sub;
    doc.save((err, result) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(result)
      }
    })
  })
};

const saveConnection = (geo, ip, userAgent, deviceType, appType, sessionid, token, userid) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new ConnectionModel();
      doc.sessionid = sessionid;
      doc.token = token;
      doc.ipAddress = ip;
      doc.userId = userid;
      doc.userAgent = userAgent;
      doc.deviceType = deviceType;
      doc.appType = appType;
      doc.geo = geo
      doc.save(
        function (err, result) {
          if (err) {
            reject(err)
          }
          else {
            resolve(result)
          }
        }
      );
    } catch (error) {
      reject(error)
    }
  })
};

//access private
const logoutUser = asyncHandler(async (req, res) => {
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
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("there is no email or password");
  }
  try {
    const user = await User.findOne({ email });
    if (user || bcrypt.compare(password, user.password)) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("inValide credental");
    }
  } catch (error) {
    console.error("Error reading data:", error);
  }
});

//Generete Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
module.exports = {
  getMe,
  loginUser,
  registerUser,
  registerWithGoogle,
  logoutUser,
  googleOAuth,
};
