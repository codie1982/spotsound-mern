const express = require("express")
const route = express.Router()
const { upload } = require("../controller/uploadController")


route.post("/", upload)

module.exports = route