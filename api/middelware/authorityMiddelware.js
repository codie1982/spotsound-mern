const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const User = require("../models/userModel");
const userDB = require("../dbMap/users/usersDbmap")
const SessionModel = require("../models/sessionModel");


const getAuthorization = (authority, action) => {
    return asyncHandler(async (req, res, next) => {
        try {
            const user = req.user; // Kullanıcıyı kontrol ediyoruz
            if (!user) {
                return res.status(401).json({ message: "Kullanıcı doğrulanamadı" });
            }

            // Kullanıcının rollerini kontrol et
            let isAuthority = false;

            // Eğer kullanıcı birden fazla role sahipse, hepsini kontrol eder
            if (Array.isArray(user.roles)) {
                isAuthority = user.roles.some(role =>
                    role.authorities.some(item => {
                        // "action" alanını ve "null" durumunu kontrol ediyoruz
                        if (item.key === authority) {
                            if (action) {
                                return item.actions && item.actions[action] === true;
                            }
                            return true; // Eğer "action" null ise, sadece "authority" kontrolü yapılır
                        }
                        return false;
                    })
                );
            } else {
                // Tek bir rol varsa bu rolü kontrol et
                isAuthority = user.role.authorities.some(item => {
                    if (item.key === authority) {
                        if (action) {
                            return item.actions && item.actions[action] === true;
                        }
                        return true; // Eğer "action" null ise, sadece "authority" kontrolü yapılır
                    }
                    return false;
                });
            }

            if (!isAuthority) {
                return res.status(403).json({ message: "Bu işlem için yetkiniz yok" });
            }

            // Yetki varsa işlemi devam ettir
            next();
        } catch (error) {
            return res.status(500).json({ message: "Yetki kontrolü sırasında bir hata oluştu", error });
        }
    });
};

module.exports = { getAuthorization }