const express = require("express")
const route = express.Router()
const { login, logout, alllogout, register, registerWithGoogle, googleOAuth, getMe, getallusers,security_session } = require("../controller/usersController")
const { protect } = require("../middelware/authMiddelware")
const { getAuthorization } = require("../middelware/authorityMiddelware")

route.get("/", protect, getAuthorization("get_all_users"), getallusers)

route.post("/login", login)

route.post("/register", register)

route.post("/google", registerWithGoogle)

route.get("/oauth", googleOAuth)

route.post("/logout", protect, logout)
route.post("/logout/all", protect, alllogout)

route.post("/me", protect, getMe)

route.get("/security_session", security_session)
//route.put("/:id",updateUser).delete("/:id",deleteUser)
module.exports = route