const express = require("express")
const route = express.Router()
const {getUsers,setUser,updateUser,deleteUser} = require("../../controller/usersController")
route.get("/",getUsers).post("/",setUser)
route.put("/:id",updateUser).delete("/:id",deleteUser)
module.exports = route