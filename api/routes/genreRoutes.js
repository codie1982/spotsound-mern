const express = require("express")
const route = express.Router()
const {  getGenres,
    getGenre,
    createGenre,
    updateGenre,
    deleteGenre, } = require("../controller/genreController")


route.get("/:id", getGenre)
route.get("/", getGenres)
route.post("/", createGenre)
route.put("/", updateGenre)
route.delete("/", deleteGenre)

module.exports = route