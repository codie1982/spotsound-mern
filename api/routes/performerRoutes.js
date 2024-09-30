const express = require("express")
const route = express.Router()
const { getPerformers,
    getPerformer,
    createPerformer,
    updatePerformer,
    deletePerformer,
    forcePerformer,
    getPerformerGenre,
    addPerformerGenre,
    updatePerformerGenre,
    removePerformerGenre,
    getPerformerSong,
    addPerformerSong,
    updatePerformerSong,
    removePerformerSong, } = require("../controller/performerController")
const { testprotect, protect, isAuthenticated, isSessionActive } = require("../middelware/authMiddelware")


route.get("/", testprotect, getPerformers)
route.get("/:id", testprotect, getPerformer)
route.post("/", testprotect, createPerformer)
route.put("/:id", testprotect, updatePerformer)
route.delete("/:id", testprotect, deletePerformer)
route.delete("/force/:id", testprotect, forcePerformer)

route.get("/:id/genre", getPerformerGenre)
route.post("/:id/genre", addPerformerGenre)
route.put("/:id/genre", updatePerformerGenre)
route.delete("/:id/genre", removePerformerGenre)

route.get("/:id/song", getPerformerSong)
route.post("/:id/song", addPerformerSong)
route.put("/:id/song", updatePerformerSong)
route.delete("/:id/song", removePerformerSong)


module.exports = route