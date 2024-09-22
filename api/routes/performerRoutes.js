const express = require("express")
const route = express.Router()
const { getPerformers,
    getPerformer,
    createPerformer,
    updatePerformer,
    deletePerformer,
    getPerformerGenre,
    addPerformerGenre,
    updatePerformerGenre,
    removePerformerGenre,
    getPerformerSong,
    addPerformerSong,
    updatePerformerSong,
    removePerformerSong, } = require("../controller/performerController")


route.get("/", getPerformers)
route.get("/:id", getPerformer)
route.post("/", createPerformer)
route.put("/", updatePerformer)
route.delete("/", deletePerformer)

route.get("/:id/genre", getPerformerGenre)
route.post("/:id/genre", addPerformerGenre)
route.put("/:id/genre", updatePerformerGenre)
route.delete("/:id/genre", removePerformerGenre)

route.get("/:id/song", getPerformerSong)
route.post("/:id/song", addPerformerSong)
route.put("/:id/song", updatePerformerSong)
route.delete("/:id/song", removePerformerSong)


module.exports = route