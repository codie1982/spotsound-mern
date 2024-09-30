const express = require("express")
const route = express.Router()
const { getSongs,
    getSong,
    createSong,
    updateSong,
    deleteSong, } = require("../controller/songController")
const { getAuthorization } = require("../middelware/authorityMiddelware")
const { protect, testprotect, } = require("../middelware/authMiddelware")

route.get("/", protect, getAuthorization("song", "read"), getSongs)
route.get("/:id", protect, getAuthorization("song", "read"), getSong)
route.post("/", protect, getAuthorization("song", "write"), createSong)
route.put("/", protect, getAuthorization("song", "update"), updateSong)
route.delete("/", protect, getAuthorization("song", "delete"), deleteSong)

module.exports = route