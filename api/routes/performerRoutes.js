const express = require("express")
const route = express.Router()
const {checkConnection,connectionLanguage} = require("../controller/connectionController")


route.get("/",checkConnection)

module.exports = route