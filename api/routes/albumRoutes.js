const express = require("express")
const route = express.Router()
const { getAlbums, getAlbum, createAlbum, updateAlbum, deleteAlbum } = require("../controller/albumController")
const { protect, isAuthenticated, isSessionActive } = require("../middelware/authMiddelware")

route.get("/:id", getAlbum)
route.get("/", getAlbums)
route.post("/", createAlbum)
route.put("/", updateAlbum)
route.delete("/", deleteAlbum)

module.exports = route