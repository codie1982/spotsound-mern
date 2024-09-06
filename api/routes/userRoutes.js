const express = require("express")
const route = express.Router()
const {loginUser,logoutUser,registerUser,registerWithGoogle,googleOAuth,getMe} = require("../controller/usersController")
const {protect,isAuthenticated,isSessionActive} = require("../middelware/authMiddelware")

route.post("/login",loginUser)
route.post("/register",registerUser)
route.post("/google",registerWithGoogle)
route.get("/oauth",googleOAuth)
route.post("/logout",isSessionActive,protect,logoutUser)
route.post("/me",isSessionActive,protect,getMe)

//route.put("/:id",updateUser).delete("/:id",deleteUser)
module.exports = route