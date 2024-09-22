const express = require("express")
const route = express.Router()
const { getBlogGalleries,
    getBlogGallery,
    createBlogGallery,
    updateBlogGallery,
    deleteBlogGallery, } = require("../controller/blogGalleryController")


route.get("/", getBlogGalleries)
route.get("/:id", getBlogGallery)
route.post("/", createBlogGallery)
route.put("/", updateBlogGallery)
route.delete("/", deleteBlogGallery)

module.exports = route