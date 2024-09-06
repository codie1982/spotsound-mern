const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.NODE_ENV == "development" ? false : true, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_ADRESS, // Kullanıcı adı
        pass: process.env.MAIL_PASSWORD, // Şifreniz
    },
    tls: {
        // Güvenli olmayan yeniden müzakereye izin verir, ancak güvenli değil
        rejectUnauthorized: false,
    }
});

module.exports = transporter