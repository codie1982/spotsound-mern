const express = require("express")
const route = express.Router()
const {  getOfflineContent,
    createOfflineContent,
    updateOfflineContent,
    deleteOfflineContent,
    addOfflinePerformer,
    addOfflineSong,
    addOfflineAlbum,
    removeOfflinePerformer,
    removeOfflineSong,
    removeOfflineAlbum,
} = require("../controller/offlineController")

route.get("/", getOfflineContent)
route.post("/", createOfflineContent)
route.put("/", updateOfflineContent)
route.delete("/", deleteOfflineContent)



route.post("/:id/performer", addOfflinePerformer)
route.delete("/:id/performer", removeOfflinePerformer)

route.post("/:id/song", addOfflineSong)
route.delete("/:id/song", removeOfflineSong)

route.post("/:id/album", addOfflineAlbum)
route.delete("/:id/album", removeOfflineAlbum)
module.exports = route