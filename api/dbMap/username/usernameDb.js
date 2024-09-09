const usernameModel = require("../../models/usernameModel");

const findUsername = async (username) => {
    return new Promise((resolve, reject) => {
        usernameModel.findOne({ 'usernames': { $elemMatch: { name: username } } },
            (err, result) => {
                if (err) {
                    reject(false)
                }
                resolve(true)
            }
        )
    })
}
module.exports = {
    findUsername
};
