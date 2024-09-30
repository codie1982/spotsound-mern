//General Library
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");
var geoip = require('geoip-lite');
const { v4: uuidv4 } = require('uuid');
const { OAuth2Client } = require("google-auth-library");

//Models
const Session = require("../models/sessionModel.js");
const User = require("../models/userModel");
const Account = require("../models/accountModel.js");
const Username = require("../models/usernameModel");
const Authorizate = require("../models/authorizationModel");
const Blacklist = require("../models/blacklistModel.js");
const PackageModel = require("../models/packageModel.js");

//DBMap
const userDbmap = require("../dbMap/users/usersDbmap")
const connectionDbmap = require("../dbMap/connection/connectionDbmap");

//private library
const { generateAccessToken, generateRefreshToken, generateEmailVerificationToken } = require("../library/user/generate_token")
const isSingleWord = require("../library/user/isSingleWord")

//controller files
const mailController = require("../mail/mailController")
const getUserDataFromGoogle = require("./googleController");

//constans
const CONSTANT = require("../constant/users/user_constant")
//helpers
const ApiResponse = require("../helpers/response.js")

const SCOPE = "https://www.googleapis.com/auth/userinfo.profile email openid"
const redirecServertUrl = process.env.NODE_ENV == "development" ? "http://127.0.0.1:5001" : "https://" + process.env.REDIRECT_SERVER_URL + "/api/users/oauth";
const redirecUrl = process.env.NODE_ENV == "development" ? "http://127.0.0.1:3000" : "https://" + process.env.REDIRECT_URL;
const allow_origin_url = process.env.NODE_ENV == "development" ? "http://localhost:3000" : "https://" + process.env.ALLOW_ORJIN_URL;

//access private
const getallusers = asyncHandler(async (req, res) => {
  const users = (await User.find({}, ["-password"])
    .populate({
      path: 'role',
      select: ['role', 'level', 'defaultRole'] // authorities alanını hariç tut
    })
    .populate({
      path: "username", select: "username"
    })
    .populate({
      path: "account", populate: { path: "packages.packageid", select: ["title", "description", "isRenewable", "duration"] }, select: ["packages"]
    })
  );
  try {
    res.status(200)
      .json(ApiResponse.success(200, "Connection Status", users))
  } catch (error) {
    console.error("Error reading data:", error);
  }
});
//access private
const getMe = asyncHandler(async (req, res) => {
  const { name, email, profileImage } = await userDbmap.getUserInfo(req.user._id)
  try {
    var data = { name, email, image: profileImage.path, }
    res.status(200)
      .json(ApiResponse.success(data, 200, "Connection Status"))
  } catch (error) {
    console.error("Error reading data:", error);
  }
});
//access public
const register = asyncHandler(async (req, res) => {
  const { firstname, lastname, username, email, device, provider, password } = req.body;
  try {

    if (provider == CONSTANT.EMAIL) {
      const userAgent = req.headers["user-agent"]; // Kullanıcı ajanı (tarayıcı bilgisi)
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; // Kullanıcının IP adresi

      if (!username || !email || !password) res.status(400).json(ApiResponse.error({}, 400, "Please add all fields"))

      if (password.length < 8) {
        return res.status(400).json(ApiResponse.error(400, "Şifre en az 8 karakter olmalıdır", {}));
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json(ApiResponse.error({}, 400, "Geçerli bir e-posta adresi girin"));
      }

      // Ekstra: Karmaşıklık için regex kullanabilirsiniz
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json(ApiResponse.error(400, "Şifre en az bir büyük harf, bir küçük harf, bir sayı ve özel karakter içermelidir", {}));
      }


      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(username)) {
        return res.status(400).json(ApiResponse.error({}, 400, "Kullanıcı adı yalnızca harf, rakam ve alt çizgi içerebilir"));
      }
      if (!isSingleWord(username)) return res.status(400).json(ApiResponse.error({}, 400, "Kullanıcı adı tek kelime olmalı"))

      const isUserNameExist = await Username.find({ username });
      if (isUserNameExist.length > 0) return res.status(400).json(ApiResponse.error(null, 400, "Username Already Exist"));
      //check Email
      const isUserExist = await userDbmap.isUserFromEmail(email);
      if (isUserExist) return res.status(400).json(ApiResponse.error({}, 400, "User Already register"));
      //check Username

      const defaultRole = await Authorizate.findOne({ defaultRole: true })
      if (!defaultRole) return res.status(400).json(ApiResponse.error(400, "User role can't read", {}));

      //Create User
      const doc = new User();
      doc.password = await makepassword(password);
      doc.firstname = firstname;
      doc.lastname = lastname;
      doc.email = email;
      doc.appType = device;
      doc.authProvider = provider
      doc.role = defaultRole._id
      const mUser = await doc.save()

      if (mUser) {
        let crUserid = mUser._id
        //Kullancı Adı kayıt
        const _username = await new Username({ crUserid, username }).save();
        await User.findByIdAndUpdate(crUserid, { username: _username._id })
        //Kullancı Yetkileri Kayıt

        const sPackage = await PackageModel.findOne({ default_package: true, delete: false, active: true })
        //Kullancı Yetkileri Kayıt
        const newAccount = new Account({
          userid: crUserid,
          packages: [
            {
              packageid: sPackage._id,
              masteruserid: crUserid,
              sharedWith: [],
            }
          ]
        })
        const _account = await newAccount.save()
        await User.findByIdAndUpdate(crUserid, { account: _account._id })
        let isSuccess = false;
        try {
          await mailController.mailVerify(email);
          isSuccess = true;
          message = "Kaydınız başarı ile yapıldı. Lütfen mail onay Kodunu gönderiniz";

        } catch (err) {
          isSuccess = false;
          message = "Kaydınız başarı ile yapıldı. Ancak mail kodunuz gönderilmedi. giriş ekranından yeniden mail aktivitesini onaylayın."
          console.error("Mail gönderilemedi:", err);
        }
        res.status(201).json(ApiResponse.success(201, message, {}));
      } else {
        provider
        res.status(400);
        throw new Error("InValied DB User ERROR");
      }

    } else {
      return res.status(400).json(ApiResponse.error({}, 400, "Giriş noktası belli değil: " + err.message));
    }
  } catch (err) {
    return res.status(500).json(ApiResponse.error({}, 500, "Veritabanı hatası: " + err.message));
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
      const userToken = generateAccessToken(selectedUserid);
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
  const userid = req.user._id; // Kullanıcı kimliği alınıyor (token'dan gelen bilgi)
  const sessionid = req.decoded.sessionid; // Oturum kapatma isteğinde oturum ID'si alınır
  try {
    console.log("userid", userid)
    console.log("sessionid", sessionid)
    // Aktif oturumu bul
    const session = await Session.findOne({
      userid,
      sessionid,
      status: 'active'
    });
    if (!session) {
      return res.status(404).json(ApiResponse.error(404, "Aktif oturum bulunamadı.", {}));
    }

    // Oturumu kapat (status: 'closed')
    session.status = 'closed';
    session.closedAt = new Date(); // Oturum kapatma zamanı
    session.closedReason = 'logout'; // Çıkış nedeniyle kapatıldı
    await session.save();
    // Token'ı blacklist'e ekle
    const blacklistedToken = new Blacklist({
      token: req.access_token, // Token'ı kara listeye ekle
      expiresAt: new Date(req.decoded.exp * 1000) // Token'ın süresi dolma zamanını ekle
    });
    await blacklistedToken.save();
    // Logout başarılı
    res.status(200).json(ApiResponse.success(200, "Oturum başarıyla kapatıldı.", {}));
  } catch (error) {
    console.error("Logout işlemi sırasında hata oluştu:", error);
    return res.status(500).json(ApiResponse.error(500, "Sunucu hatası. Lütfen tekrar deneyin.", {}));
  }
});
//access private
const alllogout = asyncHandler(async (req, res) => {
  const userid = req.user._id; // Kullanıcı kimliği alınıyor (token'dan gelen bilgi)
  try {

    // Aktif oturumu bul
    const sessions = await Session.find({
      userid,
      status: 'active'
    });
    if (!sessions || sessions.length == 0) {
      return res.status(404).json(ApiResponse.error(404, "Aktif oturum bulunamadı.", {}));
    }
    for (let i = 0; i < sessions.length; i++) {
      // Token'ı blacklist'e ekle
      const decoded = jwt.verify(sessions[i].access_token, process.env.JWT_SECRET);
      const blacklistedToken = new Blacklist({
        token: sessions[i].access_token, // Token'ı kara listeye ekle
        expiresAt: new Date(decoded.exp * 1000) // Token'ın süresi dolma zamanını ekle
      });

      await blacklistedToken.save();

      let _sessionid = sessions[i]._id
      await Session.findByIdAndUpdate(_sessionid, {
        status: 'closed',
        closedAt: new Date(),
        closedReason: 'logout',
      })

    }
    // Logout başarılı
    res.status(200).json(ApiResponse.success(200, "Tüm Oturumlar başarıyla kapatıldı.", {}));
  } catch (error) {
    console.error("Logout işlemi sırasında hata oluştu:", error);
    return res.status(500).json(ApiResponse.error(500, "Sunucu hatası. Lütfen tekrar deneyin.", {}));
  }
});
//access private
const security_session = asyncHandler(async (req, res) => {
  const { token } = req.query;; // Kullanıcı kimliği alınıyor (token'dan gelen bilgi)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userid, sessionid, deviceid } = decoded;

    // Kullanıcıyı ve oturumu bulun
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    // Eğer kullanıcı oturumu kendine ait değil diyorsa:
    // 1. Mevcut oturumları kapat
    await Session.updateMany({ userid, status: 'active' }, { status: 'closed', closedReason: 'forced' });

    // 2. Şifreyi devre dışı bırak (password_active = false)
    user.password_active = false;
    await user.save();

    // 3. Tokenı kara listeye al
    const blacklistedToken = new Blacklist({
      token: token, // Token'ı kara listeye ekle
      expiresAt: new Date(decoded.exp * 1000) // Token'ın süresi dolma zamanını ekle
    });
    await blacklistedToken.save();
    // Logout başarılı
    res.status(200).json(ApiResponse.success(200, "Güvenlik gerekçesi ile Tüm Oturumlar kapatıldı ve şifreniz devre dışı bırakıldı. Lütfen yeni bir şifre belirleyin.", {}));
  } catch (error) {
    console.error("Logout işlemi sırasında hata oluştu:", error);
    return res.status(500).json(ApiResponse.error(500, "Sunucu hatası. Lütfen tekrar deneyin.", {}));
  }
});
//access public
const login = asyncHandler(async (req, res) => {
  const { email, password, phoneNumber, device, deviceid } = req.body;
  const userAgent = req.headers["user-agent"];
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const geo = geoip.lookup(ip);
  const sessionid = uuidv4();

  if (!device) {
    return res.status(400).json(ApiResponse.success(200, "Cihaz türü belirtilmeli (web, mobile, tv).", {}));
  }

  let user;
  if (email && password) {
    if (!email || !password) {
      return res.status(400).json(ApiResponse.success(200, "Kullanıcı adı ve şifre gerekli", {}));
    }

    try {
      // Kullanıcıyı email ile bul
      user = await User
        .findOne({ email })
        .populate({ path: 'role', select: ['role', 'level', 'defaultRole'] })
        .populate({ path: "username", select: "username" })
        .populate({
          path: "account",
          populate: { path: "packages.packageid", select: ["title", "description", "isRenewable", "duration"] },
          select: ["packages"]
        });

      if (!user) {
        return res.status(404).json(ApiResponse.error(404, "Kullanıcı bulunamadı", {}));
      }

      //new Date(Date.now());

      if (user.password_expire_date < new Date(Date.now())) {
        return res.status(401).json(ApiResponse.error(401, "Şifrenizin süresi dolmuş yeni şifre oluşturun.", {}));
      }

      if (!user.password_active) {
        return res.status(401).json(ApiResponse.error(401, "Şifreniz geçerli değil. Lütfen şifrenizi değiştirin.", {}));
      }

      // Şifreyi doğrula
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json(ApiResponse.error(402, "Geçersiz şifre", {}));
      }

      // E-posta doğrulama kontrolü
      if (!user.email_verify) {
        return res.status(403).json(ApiResponse.error(403, "E-posta doğrulaması yapılmamış. Lütfen e-posta doğrulamanızı yapın.", {}));
      }

    } catch (error) {
      return res.status(500).json(ApiResponse.error(500, "Sunucu hatası, lütfen tekrar deneyin", {}));
    }
  } else if (phoneNumber) {
    // Telefon numarası ile giriş işlemleri
    // OTP doğrulama gibi yöntemler burada eklenebilir.
  }

  const userid = user._id;

  // Cihaz bilgilerini kontrol et (daha önce kullanılan cihazlar ile karşılaştır)
  const existingSessions = await Session.find({ userid, status: 'active' });

  let isSameDevice = false
  let sameSession;
  for (let i = 0; i < existingSessions.length; i++) {
    if (existingSessions[i].deviceInfo.deviceid === req.body.deviceid && existingSessions[i].userAgent === userAgent && existingSessions[i].ipAddress === ip) {
      isSameDevice = true;
      sameSession = existingSessions[i]
      break;
    }
  }
  let isNewDevice = true;
  if (device === 'mobile' || device === 'tv') {
    for (let i = 0; i < existingSessions.length; i++) {
      if (existingSessions[i].deviceInfo.deviceid == req.body.deviceid) {
        isNewDevice = false
        break
      }
    }
  }

  if (isSameDevice) {
    // Mevcut oturum zaten açık, yeni oturum açılmasına izin verilmez
    return res.status(400).json(ApiResponse.error(400, "Bu cihazda zaten aktif bir oturumunuz var.",
      {
        access_token: sameSession.access_token,
        lang: geo ? (geo.country === "TR" ? "TR" : "EN") : "TR"
      }
    ));
  } else {

  }

  try {
    const accessToken = generateAccessToken(userid, sessionid);
    const refreshToken = generateRefreshToken(userid, sessionid);

    // Kullanıcının aktif oturumlarını kontrol et (her platform için maksimum 3 oturum)
    const activeSessionsCount = await Session.countDocuments({ userid, deviceInfo: { type: device }, status: "active", closedReason: "none" });
    if (activeSessionsCount >= 3) {
      return res.status(400).json(ApiResponse.error(400, `${device} için maksimum oturum sayısına ulaştınız. Lütfen başka bir cihazda çıkış yapın.`, {}));
    }

    // Oturum bilgilerini Session modeline kaydet
    const sessionData = {
      userid,
      sessionid,
      access_token: accessToken,
      refresh_token: refreshToken,
      ipAddress: ip,
      userAgent,
      geoLocation: geo ? { country: geo.country, region: geo.region, city: geo.city } : {},
      deviceInfo: {
        deviceid: req.body.deviceid,
        type: device,
        browser: device === 'web' ? getBrowserFromUserAgent(userAgent) : null,
        os: getOsFromUserAgent(userAgent),
        osVersion: getOsVersionFromUserAgent(userAgent),
        deviceModel: device === 'mobile' ? req.body.deviceModel : null,
        appVersion: device === 'mobile' || device === 'tv' ? req.body.appVersion : null
      },
      wifiConnections: req.body.wifiConnections || []
    };

    const newSession = new Session(sessionData); // Yeni oturum kaydını veritabanına kaydet
    const savedSession = await newSession.save();
    if (existingSessions.length > 1 && isNewDevice) {
      // Eğer cihaz farklıysa ve kullanıcının 1 açık bir oturumu var ise

      await mailController.diffrentDeviceMail(email, user.firstname, savedSession.createdAt, device, getOsFromUserAgent(userAgent), ip, geo == null ? "" : geo.city, generateEmailVerificationToken(userid, email));
    }



    // Kullanıcı bilgilerini ve token'ı döndür
    let login_message = isNewDevice ? "Başarıyla yeni bir cihazdan giriş yapıldı" : "Başarıyla giriş yapıldı"
    res.status(200).json(ApiResponse.success(200, login_message, {
      user,
      access_token: accessToken,
      lang: geo ? (geo.country === "TR" ? "TR" : "EN") : "TR"
    }));
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json(ApiResponse.error(500, "Sunucu hatası, lütfen tekrar deneyin", {}));
  }
});

const makepassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword
}
/**
  •	User-Agent Bilgisi: User-Agent bilgisi, tarayıcı tarafından her HTTP isteğinde gönderilen bir başlıktır. Bu başlık tarayıcı, işletim sistemi ve cihaz hakkında bilgi içerir.
  •	Tarayıcı Tespiti: userAgent.includes() ile tarayıcıya özgü stringleri kontrol ederek tarayıcı ismi döndürülür:
  •	Chrome: chrome kelimesi User-Agent içinde geçiyor, ancak edge geçmiyorsa tarayıcı Chrome’dur.
  •	Safari: safari kelimesi User-Agent içinde geçiyorsa ancak chrome geçmiyorsa Safari tarayıcı kullanılıyordur.
  •	Firefox: firefox kelimesi içeriliyorsa tarayıcı Firefox’tur.
  •	Edge: edge veya edg/ içeriliyorsa Microsoft Edge tarayıcısıdır.
  •	Opera: opera veya opr/ içeriliyorsa Opera tarayıcısıdır.
  •	Internet Explorer: trident içeriliyorsa Internet Explorer tarayıcısıdır.
  •	Unknown: Bilinmeyen bir tarayıcı kullanılıyorsa “Unknown” olarak döner.

 * @param {*} userAgent 
 * @returns 
 */
const getBrowserFromUserAgent = (userAgent) => {
  userAgent = userAgent.toLowerCase();

  if (userAgent.includes('chrome') && !userAgent.includes('edge')) {
    return 'Chrome';
  } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    return 'Safari';
  } else if (userAgent.includes('firefox')) {
    return 'Firefox';
  } else if (userAgent.includes('edge') || userAgent.includes('edg/')) {
    return 'Edge';
  } else if (userAgent.includes('opera') || userAgent.includes('opr/')) {
    return 'Opera';
  } else if (userAgent.includes('trident')) {
    return 'Internet Explorer';
  } else {
    return 'Unknown'; // Tarayıcı tespit edilemezse 'Unknown' döner
  }
};
/**
 * 	•	İşletim Sistemi Tespiti: userAgent.includes() ile OS’a özgü stringler kontrol edilerek işletim sistemi ismi döndürülür:
  •	Windows 10: windows nt 10.0 içeriyorsa.
  •	Windows 8.1: windows nt 6.3 içeriyorsa.
  •	Windows 8: windows nt 6.2 içeriyorsa.
  •	Windows 7: windows nt 6.1 içeriyorsa.
  •	Mac OS: mac os x içeriyorsa.
  •	Android: android içeriyorsa.
  •	iOS: iphone veya ipad içeriyorsa.
  •	Linux: linux içeriyorsa.
  •	Unknown: Bilinmeyen bir işletim sistemi kullanılıyorsa “Unknown” döner.

 * @param {*} userAgent 
 * @returns 
 */
const getOsFromUserAgent = (userAgent) => {
  userAgent = userAgent.toLowerCase();

  if (userAgent.includes('windows nt 10.0')) {
    return 'Windows 10';
  } else if (userAgent.includes('windows nt 6.3')) {
    return 'Windows 8.1';
  } else if (userAgent.includes('windows nt 6.2')) {
    return 'Windows 8';
  } else if (userAgent.includes('windows nt 6.1')) {
    return 'Windows 7';
  } else if (userAgent.includes('mac os x')) {
    return 'Mac OS';
  } else if (userAgent.includes('android')) {
    return 'Android';
  } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
    return 'iOS';
  } else if (userAgent.includes('linux')) {
    return 'Linux';
  } else {
    return 'Unknown'; // OS tespit edilemezse 'Unknown' döner
  }
};

/**
 * 	•	Windows İşletim Sistemi: User-Agent içinde windows nt ile birlikte OS sürüm bilgisi yer alır.
  •	windows nt 10.0 → Windows 10
  •	windows nt 6.3 → Windows 8.1
  •	windows nt 6.2 → Windows 8
  •	windows nt 6.1 → Windows 7
  •	windows nt 5.1 → Windows XP
  •	windows nt 5.0 → Windows 2000
  •	Mac OS X: Mac OS sürümü genellikle mac os x ifadesiyle birlikte gelir. Örneğin mac os x 10_15_7 → macOS 10.15.7 olarak döndürülür.
  •	iOS: iOS sürüm bilgisi os 14_0 like mac os x gibi User-Agent başlığı içinde yer alır. Bu ifade 14_0 şeklinde gelir ve . ile değiştirilir → iOS 14.0.
  •	Android: Android sürüm bilgisi genellikle doğrudan User-Agent içinde android 11 gibi bir ifade ile yer alır.
  •	Linux: Çoğu User-Agent’ta Linux dağıtımının sürüm bilgisi yer almaz, bu nedenle Unknown döndürülür.
 * @param {*} userAgent 
 * @returns 
 */
const getOsVersionFromUserAgent = (userAgent) => {
  userAgent = userAgent.toLowerCase();

  // Windows sürümleri
  if (userAgent.includes('windows nt 10.0')) {
    return '10';
  } else if (userAgent.includes('windows nt 6.3')) {
    return '8.1';
  } else if (userAgent.includes('windows nt 6.2')) {
    return '8';
  } else if (userAgent.includes('windows nt 6.1')) {
    return '7';
  } else if (userAgent.includes('windows nt 5.1')) {
    return 'XP';
  } else if (userAgent.includes('windows nt 5.0')) {
    return '2000';

    // macOS sürümü
  } else if (userAgent.includes('mac os x')) {
    const macVersionMatch = userAgent.match(/mac os x ([\d_]+)/);
    return macVersionMatch ? macVersionMatch[1].replace(/_/g, '.') : 'Unknown';

    // iOS sürümü
  } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
    const iosVersionMatch = userAgent.match(/os ([\d_]+) like mac os x/);
    return iosVersionMatch ? iosVersionMatch[1].replace(/_/g, '.') : 'Unknown';

    // Android sürümü
  } else if (userAgent.includes('android')) {
    const androidVersionMatch = userAgent.match(/android ([\d.]+)/);
    return androidVersionMatch ? androidVersionMatch[1] : 'Unknown';

    // Linux sürümü (User-Agent içinde genellikle sürüm bilgisi olmaz)
  } else if (userAgent.includes('linux')) {
    return 'Unknown'; // Genellikle Linux dağıtımlarında sürüm bilgisi User-Agent'ta bulunmaz
  }

  return 'Unknown'; // Eğer OS tespit edilemezse "Unknown" döner
};


module.exports = {
  getMe,
  login,
  register,
  registerWithGoogle,
  logout,
  alllogout,
  googleOAuth,
  getallusers, security_session
};
