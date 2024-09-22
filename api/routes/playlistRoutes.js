const express = require("express")
const route = express.Router()
const { 
    getPlaylists,
    getPlaylist,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    getPlaylistSong,
    addPlaylistSong,
    updatePlaylistSong,
    removePlaylistSong, } = require("../controller/playlistController")


route.get("/:id", getPlaylist)
route.get("/", getPlaylists)
route.post("/", createPlaylist)
route.put("/", updatePlaylist)
route.delete("/", deletePlaylist)


route.get("/:id/song", getPlaylistSong)
route.post("/:id/song", addPlaylistSong)
route.put("/:id/song", updatePlaylistSong)
route.delete("/:id/song", removePlaylistSong)
module.exports = route