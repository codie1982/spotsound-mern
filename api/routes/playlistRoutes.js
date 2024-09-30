const express = require("express")
const route = express.Router()
const { testprotect, protect, isAuthenticated, isSessionActive } = require("../middelware/authMiddelware")

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


route.get("/", testprotect, getPlaylist)
route.get("/", testprotect, getPlaylists)
route.post("/", testprotect, createPlaylist)
route.put("/", testprotect, updatePlaylist)
route.delete("/", testprotect, deletePlaylist)


route.get("/:id/song",testprotect, getPlaylistSong)
route.post("/:id/song",testprotect, addPlaylistSong)
route.put("/:id/song",testprotect, updatePlaylistSong)
route.delete("/:id/song",testprotect, removePlaylistSong)
module.exports = route