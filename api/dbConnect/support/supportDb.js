const mongoose = require('mongoose');
const SupportModel = require("../../models/supportModel");
const getSupportCountbyUser = async (userid) => {
    return new Promise((resolve, reject) => {
        SupportModel.countDocuments({ userId: userid }, null,
            (err, count) => {
                if (err) {
                    reject(err)
                }
                resolve(count)
            }
        )
    })
}
const getSupportsbyUser = async (userid) => {
    return new Promise((resolve, reject) => {
        SupportModel.findOne({ userId: userid, delete: false }, null, null,
            (err, supports) => {
                console.log("err, supports", err, supports)
                if (err) {
                    reject(err)
                }
                resolve(supports)
            }
        )
    })
}
const getSupportDetail = async (supportid) => {
    return new Promise((resolve, reject) => {
        SupportModel.findById(supportid, null, null,
            (err, supports) => {
                console.log("err, supports", err, supports)
                if (err) {
                    reject(err)
                }
                resolve(supports)
            }
        )
    })
}
const updateSupportSolved = async (supportid, solved) => {
    return new Promise((resolve, reject) => {
        SupportModel.findByIdAndUpdate(supportid, { solved }, { new: true },
            (err, updateSupport) => {
                console.log("err, supports", err, updateSupport)
                if (err) {
                    reject(err)
                }
                resolve(updateSupport)
            }
        )
    })
}
const forceDeleteSupport = async (supportid) => {
    return new Promise((resolve, reject) => {
        SupportModel.findByIdAndDelete(supportid, null,
            (err, deleteSupport) => {
                if (err) {
                    reject(err)
                }
                resolve(deleteSupport)
            }
        )
    })
}
const deleteSupport = async (supportid) => {
    return new Promise((resolve, reject) => {
        SupportModel.findByIdAndUpdate(supportid, { delete: true }, { new: true },
            (err, updateSupport) => {
                if (err) {
                    reject(err)
                }
                resolve(updateSupport)
            }
        )
    })
}
const getSupportsbyUserByUnsolve = async (userid) => {
    return new Promise((resolve, reject) => {
        SupportModel.findById({ userId: userid, solve: false }, null, null,
            (err, supports) => {
                if (err) {
                    reject(err)
                }
                resolve(supports)
            }
        )
    })
}

module.exports = {
    getSupportsbyUser, getSupportCountbyUser,
    getSupportsbyUserByUnsolve,
    updateSupportSolved, getSupportDetail, deleteSupport,forceDeleteSupport
};
