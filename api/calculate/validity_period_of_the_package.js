
const PackageModel = require("../models/packageModel")
const moment = require('moment'); // Tarih ve zaman hesaplamaları için moment.js kullanabiliriz

//packageid => ObjetID
const isvalidityPeriod = async (package_detail, createdAt) => {
    const package = package_detail
    return new Promise((resolve, reject) => {

        if (package.duration.unlimited) {
            resolve(true)
        } else {
            // Süreyi hesapla
            let expireDate;
            switch (duration.interval) {
                case 'day':
                    expireDate = moment(createdAt).add(duration.time, 'days');
                    break;
                case 'month':
                    expireDate = moment(createdAt).add(duration.time, 'months');
                    break;
                case 'year':
                    expireDate = moment(createdAt).add(duration.time, 'years');
                    break;
                default:
                    reject()
                    throw new Error('Geçersiz zaman aralığı.');
            }
            // Şu anki zamanı al
            const now = moment();
            // Eğer expireDate şimdiden küçükse, süresi dolmuş demektir
            resolve(now.isAfter(expireDate))
        }

    })
}

module.exports = { isvalidityPeriod }