const express = require("express")
const route = express.Router()
const { getSong,
    createSong,
    updateSong,
    deleteSong, } = require("../controller/songController")

route.get("/:id", getSong)
route.post("/", createSong)
route.put("/", updateSong)
route.delete("/", deleteSong)

module.exports = route