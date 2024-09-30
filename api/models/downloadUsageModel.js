const mongoose = require("mongoose");
const schema = require("../schema/downloadUsageSchema")
module.exports = mongoose.model("download_usage", schema);