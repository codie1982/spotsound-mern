const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
    },
}, { timestamps: true });

module.exports = mongoose.model("users",userSchema);