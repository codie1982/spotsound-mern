"use strict";

var express = require("express");
var route = express.Router();
var _require = require("../controller/verifyController"),
  aprove = _require.aprove,
  verify = _require.verify;
//Mail kodu oluşturmak için
route.post("/", verify);
//Mail kodu Onaylamak için
route.put("/", aprove);
module.exports = route;