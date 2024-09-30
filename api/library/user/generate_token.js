//Generete Token
const jwt = require("jsonwebtoken");

function generateAccessToken(id, sessionid) {
    return jwt.sign({ id, sessionid }, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });
};

function generateRefreshToken(id, sessionid) {
    return jwt.sign({ id, sessionid }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

function generateEmailVerificationToken(userid, email) {
    return jwt.sign(
        { userid, email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // 1 saat geçerli token
    );
};
module.exports = {
    generateAccessToken, generateRefreshToken,generateEmailVerificationToken
}