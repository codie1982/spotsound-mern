const express = require("express")
const route = express.Router()
const {addsupport,getSupports,updateSolve, deleteSupport, forceDeleteSupport} = require("../controller/supportController")
const {protect,isSessionActive} = require("../middelware/authMiddelware")
route.get("/",protect,getSupports)
route.post("/",protect,addsupport)
route.put("/solve",protect,updateSolve)
route.delete("/",protect,deleteSupport)
route.delete("/force",
    protect,forceDeleteSupport)
module.exports = route