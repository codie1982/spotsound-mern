const AccountModel = require("../models/accountModel")


const calculateBalancing = async (userid) => {
    const userAccount = await AccountModel.findOne({ userid })
    return new Promise((resolve, reject) => {

        //Paketin geçirlilik süresi dolmamış ise
        /**
         *  expireTime: { type: Date },
            uploadsonglimit: { type: Number },
            uploadvideolimit: { type: Number },
         */
        const usertotallimit = userAccount.packages.reduce((acc, package) => {
            if (package.expireTime < Date.now()) {
                acc.uploadsonglimit += package.uploadsonglimit
                acc.uploadvideolimit += package.uploadvideolimit
            }
            return acc
        }, { uploadsonglimit: 0, uploadvideolimit: 0 })

        const songbalance = userAccount.balance.song - usertotallimit.uploadsonglimit;
        const videousege = userAccount.balance.video - usertotallimit.uploadvideolimit;

        resolve({ song: songbalance, video: videousege })
    })
}
const calculateReminding = () => {

}
module.exports = { calculateBalancing, calculateReminding }