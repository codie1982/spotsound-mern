const mongoose = require("mongoose");
const albumSchema = require("../schema/albumSchema");
module.exports = mongoose.model("albums", albumSchema);