const express = require("express")
const route = express.Router()
const { getPerformer, createPerformer, updatePerformer, deletePerformer } = require("../controller/performerController")


route.get("/:id", getPerformer)
route.post("/", createPerformer)
route.put("/", updatePerformer)
route.delete("/", deletePerformer)

module.exports = route