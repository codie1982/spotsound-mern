"use strict";

var express = require("express");
var route = express.Router();
var _require = require("../controller/usersController"),
  login = _require.login,
  logout = _require.logout,
  register = _require.register,
  registerWithGoogle = _require.registerWithGoogle,
  googleOAuth = _require.googleOAuth,
  getMe = _require.getMe;
var _require2 = require("../middelware/authMiddelware"),
  protect = _require2.protect,
  isAuthenticated = _require2.isAuthenticated,
  isSessionActive = _require2.isSessionActive;
route.post("/login", login);
route.post("/register", register);
route.post("/google", registerWithGoogle);
route.get("/oauth", googleOAuth);
route.post("/logout", isSessionActive, protect, logout);
route.post("/me", isSessionActive, protect, getMe);

//route.put("/:id",updateUser).delete("/:id",deleteUser)
module.exports = route;