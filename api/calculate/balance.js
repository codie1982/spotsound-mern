
const mongoose = require("mongoose");
const AccountModel = require("../models/accountModel")
const UploadUsageModel = require("../models/uploadUsageModel")
const PackageModel = require("../models/packageModel")
const { isvalidityPeriod } = require("./validity_period_of_the_package")
const { convertUnit } = require("./convertUnit");
const { SONG, VIDEO } = require("../helpers/folder");

const calculateUploadBalancing = async (userid) => {
    const userAccount = await AccountModel.findOne({ userid })
    const reminding = await calculateUserTotalUploadLimit(userAccount, userid)
    return { song: reminding.song, video: reminding.video }
}
const selectedSongPackage = async (userid) => {
    let selected_package;
    const userAccount = await AccountModel.findOne({ userid })
    for (const package of userAccount.packages) {
        try {
            const package_detail = await getPackageDetail(package.packageid);
            if (package.masteruserid.toString() === userid.toString()) {
                const isValid = await isvalidityPeriod(package_detail, package.createdAt);

                if (isValid) {
                    const songUploadLimit = await convertUnit(package_detail.limit.song.upload, package_detail.limit.song.unit, "mb");
                    const totalusage = await calculateTotalUploadSize(package.packageid, "mb");
                    let remind = calculateReminding(songUploadLimit, totalusage.song)
                    if (remind > 0) {
                        selected_package = package
                        break;
                    }
                }
            }
        } catch (error) {
            selected_package = null;
        }
    }
    return selected_package
}
async function calculateUserTotalUploadLimit(userAccount, userid) {
    const user_remind = {
        song: {
            upload: 0,
        },
        video: {
            upload: 0,
        }
    };
    // Asenkron işlemler için for...of döngüsü kullanıyoruz
    for (const package of userAccount.packages) {
        const packageid = package.packageid;

        try {
            const package_detail = await getPackageDetail(packageid);
            console.log("package_detail", package_detail)
            // Eğer paket sahibi kendisi ise
            if (package.masteruserid.toString() === userid.toString()) {
                const isValid = await isvalidityPeriod(package_detail, package.createdAt);
                console.log("isValid", isValid)
                if (isValid) {
                    const songUploadLimit = await convertUnit(package_detail.limit.song.upload, package_detail.limit.song.unit, "mb");
                    console.log("paketin verdiği toplam song yükleme limiti ->mb", songUploadLimit)
                    const videoUploadLimit = await convertUnit(package_detail.limit.video.upload, package_detail.limit.video.unit, "mb");
                    console.log("paketin verdiği toplam video yükleme limiti ->mb", videoUploadLimit)
                    const totalusage = await calculateTotalUploadSize(packageid, "mb");
                    console.log("paketin pakete ait song için toplam yükleme kullanımı ->mb", totalusage.song)
                    console.log("paketin pakete ait video için toplam yükleme kullanımı ->mb", totalusage.video)
                    if (totalusage.length != 0) {
                        user_remind.song.upload += calculateReminding(songUploadLimit, totalusage.song);
                        user_remind.video.upload += calculateReminding(videoUploadLimit, totalusage.video);
                    } else {
                        user_remind.song.upload += songUploadLimit;
                        user_remind.video.upload += videoUploadLimit;
                    }
                    console.log("video için kalan bakiye ->mb", user_remind.song.upload)
                    console.log("song için kalan bakiye ->mb", user_remind.video.upload)
                } else {
                    console.log("Paket süresi geçerli değil");
                }

            } else {
                // Eğer paket sahibi kendisi değilse, pakete alt kullanıcı olarak eklenmişse yapılacak işlemler buraya eklenebilir
                console.log("Paket sahibi başka bir kullanıcı.");
            }
        } catch (err) {
            console.error("Bir hata oluştu:", err.message);
        }
    }

    return user_remind;
}
async function getPackageDetail(packageid) {
    const package = await PackageModel.findOne({ _id: packageid })
    return package

}
async function calculateTotalUploadSize(packageid, unit) {
    try {
        const result = await UploadUsageModel.aggregate([
            {
                $match: { packageid: packageid } // Pakete göre filtreleme
            },
            {
                $group: {
                    _id: "$upload_type",
                    totals: { $sum: "$upload_size" } // totalsize değerlerini toplama
                }
            }
        ]);

        console.log('paket idsine göre toplam şarkı ve video upload kullanımları :', result);

        let totalUploads = { song: 0, video: 0 };

        // Asenkron işlemleri döngüyle işleyelim
        for (const value of result) {
            if (value._id === SONG) {
                totalUploads.song = await convertUnit(value.totals, "kb", unit);
            } else if (value._id === VIDEO) {
                totalUploads.video = await convertUnit(value.totals, "kb", unit);
            }
        }
        return totalUploads; // Promise olarak sonuç döndürülüyor

    } catch (err) {
        console.error('Toplam yükleme boyutu hesaplanırken hata:', err);
        throw err; // Hata yakalanıp Promise zincirine hata olarak fırlatılıyor
    }
}
const calculateReminding = (limit, usage) => {
    return limit - usage
}
module.exports = { calculateUploadBalancing, selectedSongPackage }