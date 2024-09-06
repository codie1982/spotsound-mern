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
                resolve({ id: user._id })
            }
        )
    })
}
const getUserInfo = async (userid) => {
    return new Promise((resolve, reject) => {
        UserModel.findById({ _id: userid }, '-password')
            .lean()
            .exec((err, user) => {
                if (err) {
                    reject(err)
                    return;
                }
                resolve({ ...user })
            })
    })
}
module.exports = {
    isUser, getUserInfo, isUserFromEmail
};
