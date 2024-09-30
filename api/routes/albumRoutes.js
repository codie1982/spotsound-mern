const express = require("express")
const route = express.Router()
const { getAlbums,
    getAlbum,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    softDeleteAlbum,
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
const { testprotect, isAuthenticated, isSessionActive } = require("../middelware/authMiddelware")

route.get("/all", getAlbums)
route.get("/", getAlbum)
route.post("/", testprotect, createAlbum)
route.put("/", updateAlbum)
route.delete("/", deleteAlbum)
route.delete("/soft", softDeleteAlbum)


route.get("/genre", getAlbumGenre)
route.post("/genre", addAlbumGenre)
route.put("/genre", updateAlbumGenre)
route.delete("/genre",testprotect, removeAlbumGenre)

route.get("/performer", getAlbumPerformer)
route.post("/performer", addAlbumPerformer)
route.put("/performer", updateAlbumPerformer)
route.delete("/performer", removeAlbumPerformer)


route.get("/song", getAlbumSong)
route.post("/song", addAlbumSong)
route.put("/song", updateAlbumSong)
route.delete("/song", removeAlbumSong)

module.exports = route