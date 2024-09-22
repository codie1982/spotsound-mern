const express = require("express")
const route = express.Router()
const {  
    getUserGenres,
    getUserGenre,
    createUserGenre,
    updateUserGenre,
    deleteUserGenre, } = require("../controller/usergenreController")


route.get("/:id", getUserGenre)
route.get("/", getUserGenres)
route.post("/", createUserGenre)
route.put("/", updateUserGenre)
route.delete("/", deleteUserGenre)

module.exports = route