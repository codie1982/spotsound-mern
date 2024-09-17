const express = require("express")
const route = express.Router()
const { upload } = require("../controller/uploadController")
const { protect, testprotect } = require("../middelware/authMiddelware")


route.post("/", testprotect, upload)

module.exports = route