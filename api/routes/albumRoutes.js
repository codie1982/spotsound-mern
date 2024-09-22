const express = require("express")
const route = express.Router()
const {  getAlbums,
    getAlbum,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    getAlbumGenre,
    addAlbumGenre,
    updateAlbumGenre,
    removeAlbumGenre,
    getAlbumPerformer,
    addAlbumPerformer,
    updateAlbumPerformer,
    removeAlbumPerformer,
    getAlbumSong,
    addAlbumSong,
    updateAlbumSong,
    removeAlbumSong, } = require("../controller/albumController")
const { protect, isAuthenticated, isSessionActive } = require("../middelware/authMiddelware")

route.get("/:id", getAlbum)
route.get("/", getAlbums)
route.post("/", createAlbum)
route.put("/", updateAlbum)
route.delete("/", deleteAlbum)

route.get("/:id/genre", getAlbumGenre)
route.post("/:id/genre", addAlbumGenre)
route.put("/:id/genre", updateAlbumGenre)
route.delete("/:id/genre", removeAlbumGenre)

route.get("/:id/performer", getAlbumPerformer)
route.post("/:id/performer", addAlbumPerformer)
route.put("/:id/performer", updateAlbumPerformer)
route.delete("/:id/performer", removeAlbumPerformer)


route.get("/:id/song", getAlbumSong)
route.post("/:id/song", addAlbumSong)
route.put("/:id/song", updateAlbumSong)
route.delete("/:id/song", removeAlbumSong)

module.exports = route