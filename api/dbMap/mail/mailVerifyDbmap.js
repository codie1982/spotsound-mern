const MailVerifyModel = require("../../models/mailverifyModel");

const isApprove = async (code) => {
    return new Promise((resolve, reject) => {
        MailVerifyModel.findOne({ code }, null, null,
            (err, result) => {
                if (err) reject(false)
                if (result) {
                    if (isExpired(result.createdAt, result.expireTime)) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                } else {
                    resolve(false)
                }
            }
        )
    })
}
const getMailFromCode = async (code) => {
    return new Promise((resolve, reject) => {
        console.log("getMailFromCode code", code)
        MailVerifyModel.findOne({ code }, null, null,
            (err, result) => {
                if (err) {
                    reject(false)
                }
                if (result) {
                    if (isExpired(result.createdAt, result.expireTime)) {
                        resolve(result.mail)
                    } else {
                        resolve(false)
                    }
                } else {
                    resolve(false)
                }
            }
        )
    })
}
function isExpired(createdAt, expireTime) {
    // createdAt zamanını al
    const createdDate = new Date(createdAt);

    // expireTime'ı milisaniye cinsinden createdAt tarihine ekle
    const expirationDate = new Date(createdDate.getTime() + expireTime);

    // Şu anki zaman ile expirationDate'i karşılaştır
    const now = Date.now();

    return now > expirationDate; // true dönerse süresi dolmuş demektir
}
module.exports = {
    isApprove, getMailFromCode
};
