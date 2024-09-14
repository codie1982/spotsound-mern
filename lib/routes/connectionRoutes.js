"use strict";

var express = require("express");
var route = express.Router();
var _require = require("../controller/connectionController"),
  checkConnection = _require.checkConnection,
  connectionLanguage = _require.connectionLanguage;
route.get("/", checkConnection);
route.get("/language", connectionLanguage);
module.exports = route;