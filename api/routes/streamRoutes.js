const express = require("express")
const route = express.Router()
const { stream } = require("../controller/streamController")
const { protect, testprotect } = require("../middelware/authMiddelware")


route.post("/", testprotect, stream)

module.exports = route