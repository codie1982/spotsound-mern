const mongoose = require("mongoose");
const uploadUsageSchema = require("../schema/uploadUsageSchema")
module.exports = mongoose.model("upload_usage", uploadUsageSchema);