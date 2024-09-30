const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const User = require("../models/userModel");
const Blacklist = require("../models/blacklistModel.js");
const Session = require("../models/sessionModel.js");
const ApiResponse = require("../helpers/response.js");
const { generateAccessToken, generateRefreshToken } = require("../library/user/generate_token")

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Bearer token'ı al
            token = req.headers.authorization.split(" ")[1];
            req.access_token = token
            // Token kara listede mi kontrol et
            let isTokenValid = await isTokenBlacklisted(token);
            if (isTokenValid) {
                return res.status(401).json(ApiResponse.error(401, "Token Geçerliliğini kaybetmiş", {}));
            }

            // Token'ı doğrula
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.decoded = decoded
            // decoded içinden sessionid ve userid alınır
            const { sessionid, id: userid } = decoded;
            // sessionid'yi request'e ekle

            // Kullanıcı bilgilerini token'dan al ve request'e ekle
            req.user = await User.findById(userid, "-password").populate("role");

            // Kullanıcı bulunamazsa hata döndür
            if (!req.user) {
                return res.status(404).json({ message: "Kullanıcı bulunamadı." });
            }

            // İşleme devam et
            next();

        } catch (error) {
            // Eğer token süresi dolmuşsa, refresh token ile yeni access token oluştur
            if (error.name === 'TokenExpiredError') {
                try {

                    const _session = await Session.findOne({ access_token: token });
                    if (!_session) {
                        return res.status(401).json({ message: "Oturum bulunamadı." });
                    }

                    const refresh_token = _session.refresh_token;

                    // Refresh token doğrulama
                    const refresh_decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);
                    const { sessionid, id: userid } = refresh_decoded;

                    // Yeni access token oluştur
                    const newAccessToken = generateAccessToken(userid, sessionid);

                    // Session'da yeni access token'ı güncelle
                    await Session.findByIdAndUpdate(_session._id, { access_token: newAccessToken });

                    // Yeni access token'ı yanıt olarak döndür
                    res.setHeader('Authorization', `Bearer ${newAccessToken}`);
                    // sessionid'yi request'e ekle
                    req.sessionid = sessionid;

                    // Kullanıcı bilgilerini token'dan al ve request'e ekle
                    req.user = await User.findById(userid, "-password").populate("role");

                    // İşleme devam et
                    next();

                } catch (error) {
                    console.error(error);
                    return res.status(401).json({ message: "Geçersiz refresh token." });
                }
            } else {
                console.error(error);
                return res.status(401).json({ message: "Geçersiz token." });
            }
        }
    } else {
        return res.status(401).json({ message: "Yetkilendirme başarısız, token bulunamadı." });
    }
});
const isTokenBlacklisted = async (token) => {
    const blacklistedToken = await Blacklist.findOne({ token });
    return !!blacklistedToken; // Eğer token blacklist'teyse true döner
};
const testprotect = asyncHandler(async (req, res, next) => {
    req.user = await User.findOne({ email: "engin_erol@hotmail.com" }, ["-password"])
        .populate("role")
    next()
})

module.exports = { protect, testprotect }