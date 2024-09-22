const express = require("express")
const route = express.Router()
const {getAlbumGallery,
    createAlbumGallery,
    updateAlbumGallery,
    deleteAlbumGallery, } = require("../controller/albumGalleryController")


route.get("/:id", getAlbumGallery)
route.post("/", createAlbumGallery)
route.put("/", updateAlbumGallery)
route.delete("/", deleteAlbumGallery)

module.exports = route