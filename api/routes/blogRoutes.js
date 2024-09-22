const express = require("express")
const route = express.Router()
const { getBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog } = require("../controller/blogController")


route.get("/", getBlogs)
route.get("/:id", getBlog)
route.post("/", createBlog)
route.put("/", updateBlog)
route.delete("/", deleteBlog)

module.exports = route