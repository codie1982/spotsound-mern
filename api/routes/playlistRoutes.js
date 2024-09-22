const express = require("express")
const route = express.Router()
const { getPlaylists,
    getPlaylist,
    createPlaylist,
    updatePlaylist,
    deletePlaylist, } = require("../controller/playlistController")


route.get("/:id", getPlaylist)
route.get("/", getPlaylists)
route.post("/", createPlaylist)
route.put("/", updatePlaylist)
route.delete("/", deletePlaylist)

module.exports = route