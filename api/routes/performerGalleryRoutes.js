const express = require("express")
const route = express.Router()
const { getPerformerGallery,
    createPerformerGallery,
    updatePerformerGallery,
    deletePerformerGallery, } = require("../controller/performerGalleryController")


route.get("/:id", getPerformerGallery)
route.post("/", createPerformerGallery)
route.put("/", updatePerformerGallery)
route.delete("/", deletePerformerGallery)

module.exports = route