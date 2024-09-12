"use strict";

var express = require("express");
var route = express.Router();
var _require = require("../controller/supportController"),
  addsupport = _require.addsupport,
  getSupports = _require.getSupports,
  updateSolve = _require.updateSolve,
  deleteSupport = _require.deleteSupport,
  forceDeleteSupport = _require.forceDeleteSupport;
var _require2 = require("../middelware/authMiddelware"),
  protect = _require2.protect,
  isSessionActive = _require2.isSessionActive;
route.get("/", protect, getSupports);
route.post("/", protect, addsupport);
route.put("/solve", protect, updateSolve);
route["delete"]("/", protect, deleteSupport);
route["delete"]("/force", protect, forceDeleteSupport);
module.exports = route;