const createdVerifyCode = require("../library/mail/createmailcode")
const transporter = require("./mailconfig")
const saveMail = require("../mail/maildb")
const mailVerifyDB = require("../mail/mailVerifydb")
const loginMail = () => {

}
const mailVerify = (email) => {
    return new Promise((resolve, reject) => {
        createdVerifyCode().then((code) => {
            mailVerifyDB
                .saveMailVerify(email, code)
                .then(() => {
                    const subject = "Mail Onayi";
                    const text = `Mail Onay Kodunuz : ${code}`
                    transporter
                        .sendMail({
                            from: process.env.MAIL_ADRESS, // Gönderici
                            to: email, // Alıcı
                            subject,
                            text
                        }, (error, info) => {
                            if (error) {
                                reject(error)
                            }
                            saveMail(process.env.MAIL_ADRESS, email, subject, text, info)
                                .then((result) => {
                                    resolve(result)
                                    if (info) console.log('Mail Onay Kodu Gönderildi: %s', info.messageId);
                                    if (result) console.log('Mesaj Kayıt edildi: %s', result);

                                }).catch((err) => {
                                    console.log('Mesaj Kayıt edilemedi: %s', err);
                                })

                        });
                })
        });
    })
}
const aprovemail = () => {
    return new Promise((resolve, reject) => {
        createdVerifyCode().then((code) => {
            mailVerifyDB
                .saveMailVerify(email, code)
                .then(() => {
                    const subject = "Mail Onayi";
                    const text = `Mail Onay Kodunuz : ${code}`
                    transporter
                        .sendMail({
                            from: process.env.MAIL_ADRESS, // Gönderici
                            to: email, // Alıcı
                            subject,
                            text
                        }, (error, info) => {
                            if (error) {
                                reject(error)
                            }
                            saveMail(process.env.MAIL_ADRESS, email, subject, text, info)
                                .then((result) => {
                                    resolve(result)
                                    if (info) console.log('Mail Onay Kodu Gönderildi: %s', info.messageId);
                                    if (result) console.log('Mesaj Kayıt edildi: %s', result);

                                }).catch((err) => {
                                    console.log('Mesaj Kayıt edilemedi: %s', err);
                                })

                        });
                })
        });
    })
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
    mailVerify,
    supportMail
}