const transporter = require("./mailconfig")
const saveMail = require("../mail/maildb")
const loginMail = () => {

}
const resigterMail = () => {

}
const supportMail = (user, subject, text) => {
    return new Promise((resolve, reject) => {
        // Test mail gönderimi
        if (user.email_verify) {
            let recevier_email = user.email;
            transporter.sendMail({
                from: process.env.MAIL_ADRESS, // Gönderici
                to: recevier_email, // Alıcı
                subject,
                text
            }, (error, info) => {
                if (error) {
                    reject(error)
                }
                saveMail(process.env.MAIL_ADRESS, recevier_email, subject, text, info)
                    .then((result) => {
                        console.log('Mesaj Kayıt edildi: %s', info.messageId);
                        console.log('Mesaj Kayıt edildi: %s', result);
                    }).catch((err) => {
                        console.log('Mesaj Kayıt edilemedi: %s', info.messageId);
                    })

            });
        }
    })
}
module.exports = {
    loginMail,
    resigterMail,
    supportMail
}