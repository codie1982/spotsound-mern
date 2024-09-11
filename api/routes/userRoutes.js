const express = require("express")
const route = express.Router()
const { login, verify, logout, register, registerWithGoogle, googleOAuth, getMe } = require("../controller/usersController")
const { protect, isAuthenticated, isSessionActive } = require("../middelware/authMiddelware")

route.post("/login", login)

route.post("/register", register)

route.post("/google", registerWithGoogle)

route.get("/oauth", googleOAuth)

route.post("/logout", isSessionActive, protect, logout)

route.post("/me", isSessionActive, protect, getMe)

//route.put("/:id",updateUser).delete("/:id",deleteUser)
module.exports = route