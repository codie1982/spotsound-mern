const express = require("express")
const route = express.Router()
const {che} = require("../controller/connectionController")


route.post("/",registerUser)

//route.put("/:id",updateUser).delete("/:id",deleteUser)
module.exports = route