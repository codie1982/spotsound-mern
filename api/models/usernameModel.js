const mongoose = require("mongoose");
const usernameModel = require("./usernameSchema")
module.exports = mongoose.model("usernamse", usernameModel);