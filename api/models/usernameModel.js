const mongoose = require("mongoose");
const usernameModel = require("../schema/usernameSchema")
module.exports = mongoose.model("username", usernameModel);