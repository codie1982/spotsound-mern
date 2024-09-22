const express = require("express")
const route = express.Router()
const { download } = require("../controller/downloadController")
const { protect, testprotect } = require("../middelware/authMiddelware")


route.post("/", testprotect, download)

module.exports = route