const mailModel = require("../models/mailModel");
module.exports = function saveMail(from, to, subject, text, info) {
    return new Promise((resolve, reject) => {
        const mailDoc = new mailModel();
        mailDoc.messageinfo = info;
        mailDoc.from = from;
        mailDoc.to = to;
        mailDoc.subject = subject;
        mailDoc.text = text;
        mailDoc.save(
            function (err, result) {
                if (err) {
                    console.log("err", err)
                    reject(err)
                }
                else {
                    console.log("result", result)
                    resolve(result)
                }
            }
        )
    })
}