const express = require("express")
const route = express.Router()
const {loginUser,registerUser,registerWithGoogle,googleOAuth,getMe} = require("../controller/usersController")
const {protect,isAuthenticated,isSessionActive} = require("../middelware/authMiddelware")

route.post("/",registerUser)
route.post("/google",registerWithGoogle)
route.get("/oauth",googleOAuth)
route.post("/login",loginUser)
route.post("/me",isSessionActive,protect,getMe)

//route.put("/:id",updateUser).delete("/:id",deleteUser)
module.exports = route