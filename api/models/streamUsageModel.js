const mongoose = require("mongoose");
const schema = require("../schema/streamUsageSchema")
module.exports = mongoose.model("stream_usage", schema);