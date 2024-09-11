module.exports = function createdVerifyCode() {
    return new Promise((resolve, reject) => {
        const code = process.env.NODE_ENV == "development" ? new Number(999999) : new Number(999999)
        resolve(code);
    })
}