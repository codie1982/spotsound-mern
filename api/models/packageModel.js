const mongoose = require("mongoose");
const packageSchema = require("../schema/packageSchema");
module.exports = mongoose.model("packages", packageSchema);