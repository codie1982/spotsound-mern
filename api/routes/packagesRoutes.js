const express = require("express")
const route = express.Router()
const { addPackage, getallPackages, getallActivePackages, getPackage, deletePackage, updatePackage } = require("../controller/packagesController")


route.post("/", addPackage)
route.get("/detail", getPackage)
route.get("/active", getallActivePackages)
route.get("/", getallPackages)
route.put("/", updatePackage)
route.delete("/", deletePackage)

module.exports = route