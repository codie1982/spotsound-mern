const mongoose = require("mongoose");
const schema = require("../schema/blogSchema");
module.exports = mongoose.model("blog", schema);