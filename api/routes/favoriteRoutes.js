const express = require("express")
const route = express.Router()
const { getFavorites,
    createFavorite,
    deleteFavorite,
    isFavorite,
    toggleFavorite
} = require("../controller/favoriteController")

route.get("/", getFavorites)
route.get("/isFavorite", isFavorite)
route.post("/", createFavorite)
route.post("/toggle", toggleFavorite)
route.delete("/", deleteFavorite)

module.exports = route