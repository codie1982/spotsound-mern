const express = require("express")
const route = express.Router()
const {checkConnection,} = require("../controller/albumController")
const { protect, isAuthenticated, isSessionActive } = require("../middelware/authMiddelware")

route.get("/",protect,checkConnection)

module.exports = route