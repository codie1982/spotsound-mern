const express = require("express")
const route = express.Router()
const {  getSubscriptions,
    getSubscription,
    createSubscription,
    updateSubscription,
    deleteSubscription, } = require("../controller/subscribersController")


route.get("/", getSubscriptions)
route.get("/:id", getSubscription)
route.post("/", createSubscription)
route.put("/", updateSubscription)
route.delete("/", deleteSubscription)

module.exports = route