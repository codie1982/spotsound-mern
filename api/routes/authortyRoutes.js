const express = require("express")
const route = express.Router()
const {   createAuthorization, getAllAuthorizationRoles, getAuthorizationRole, updateAuthorizationRole, deleteAuthorizationRole
 } = require("../controller/auhtortyController")
const { protect, isAuthenticated, isSessionActive } = require("../middelware/authMiddelware")

route.get("/", getAllAuthorizationRoles)
route.get("/", getAuthorizationRole)
route.post("/", createAuthorization)
route.put("/", updateAuthorizationRole)
route.delete("/", deleteAuthorizationRole)


//route.put("/:id",updateUser).delete("/:id",deleteUser)
module.exports = route