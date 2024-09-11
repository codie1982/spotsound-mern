const usernameModel = require("../../models/usernameModel");

const find = async (username) => {
    return new Promise((resolve, reject) => {
        usernameModel.findOne({ 'usernames': { $elemMatch: { username: username } } },
            (err, result) => {
                if (err) {
                    reject(false)
                }
                if (result) {
                    resolve(true)
                } else {
                    resolve(null)
                }

            }
        )
    })
}
const add = async (user) => {
    return new Promise((resolve, reject) => {
        const _username = user
        _username.save((err, result) => {
            if (err) {
                reject(err)
                return;
            }
            resolve({ ...result })
        })
    })
}
module.exports = {
    find, add
};
