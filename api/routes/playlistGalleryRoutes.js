const express = require("express")
const route = express.Router()
const {
    getPlaylistGallery,
    createPlaylistGallery,
    updatePlaylistGallery,
    deletePlaylistGallery, } = require("../controller/playlistGalleryController")


route.get("/:id", getPlaylistGallery)
route.post("/", createPlaylistGallery)
route.put("/", updatePlaylistGallery)
route.delete("/", deletePlaylistGallery)

module.exports = route