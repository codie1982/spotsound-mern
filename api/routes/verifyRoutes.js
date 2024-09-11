const express = require("express")
const route = express.Router()
const { aprove, verify } = require("../controller/verifyController")
//Mail kodu oluşturmak için
route.post("/", verify)
//Mail kodu Onaylamak için
route.put("/", aprove)
module.exports = route