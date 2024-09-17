const mongoose = require("mongoose");
const subscribeschema = require("../schema/subscribeschema");
module.exports =  mongoose.model('subscribe', subscribeschema);;