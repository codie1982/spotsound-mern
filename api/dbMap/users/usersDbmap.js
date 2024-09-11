const UserModel = require("../../models/userModel");

const isUser = async (userid) => {
    return new Promise((resolve, reject) => {
        UserModel.findById({ _id: userid }, null, null,
            (err, users) => {
                if (err) {
                    reject(false)
                }
                resolve(true)
            }
        )
    })
}
const isUserFromEmail = async (email) => {
    return new Promise((resolve, reject) => {
        UserModel.findOne({ email }, null, null,
            (err, user) => {
                if (err) {
                    reject(false)
                }
                if (user != null) {
                    resolve({ id: user._id })
                } else {
                    resolve(null)
                }

            }
        )
    })
}
const getUserInfo = async (userid) => {
    return new Promise((resolve, reject) => {
        UserModel.findById({ _id: userid }, '-password')
            .lean()
            .exec((err, result) => {
                if (err) {
                    reject(err)
                    return;
                }
                resolve(result)
            })
    })
}

const getUserFromMail = async (email) => {
    return new Promise((resolve, reject) => {
        UserModel.findOne({ email: email }, '-password')
            .lean()
            .exec((err, result) => {
                if (err) {
                    reject(err)
                    return;
                }
                resolve(result)
            })
    })
}

const setVerifyMail = async (userid) => {
    return new Promise((resolve, reject) => {
        UserModel.findByIdAndUpdate(userid, { email_verify: true }, { new: true }, (err, result) => {
            if (err) {
                reject(err)
                return;
            }
            resolve(result)
        })
    })
}

const add = async (user) => {
    return new Promise((resolve, reject) => {
        const _user = user
        _user.save((err, result) => {
            if (err) {
                reject(err)
                return;
            }
            console.log("result", result)
            resolve({ ...result })
        })
    })
}
module.exports = {
    isUser, getUserInfo, isUserFromEmail, add, getUserFromMail,setVerifyMail
};
