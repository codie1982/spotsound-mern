//General Library
const asyncHandler = require("express-async-handler");
//Models
const Authorization = require("../models/authorizationModel.js");
//helpers
const ApiResponse = require("../helpers/response.js")

//access private
const createAuthorization = asyncHandler(async (req, res) => {
  const { role, defaultRole, authorities } = req.body
  try {
    if (defaultRole) await Authorization.updateMany({ defaultRole: true }, { defaultRole: false })
    let isRole = await Authorization.findOne({ role })
    if (isRole) return res.status(400).json(ApiResponse.success(400, "Role already exists for this Auth ", {}));
    
    const nAuth = new Authorization({
      role,
      defaultRole,
      authorities
    })
    const newRole = await nAuth.save()
    res.status(201).json(ApiResponse.success(201, "Authorization role created successfully", newRole));
  } catch (error) {
    console.error("Error reading data:", error);
  }
});
const getAllAuthorizationRoles = asyncHandler(async (req, res) => {
  const { role, key, description, title, defaultRole } = req.body
  try {
    let AuthList = []
    let Auth = {
      key, description, title
    }
    AuthList.push(Auth)
    if (defaultRole) await Authorization.updateMany({ defaultRole: true }, { defaultRole: false })

    const nAuth = new Authorization({
      role,
      defaultRole,
      AuthList
    })
    await nAuth.save()

    res.status(201).json(ApiResponse.success(newRole, 201, "Authorization role created successfully"));
  } catch (error) {
    console.error("Error reading data:", error);
  }
});
const getAuthorizationRole = asyncHandler(async (req, res) => {
  const { role, key, description, title, defaultRole } = req.body
  try {
    let AuthList = []
    let Auth = {
      key, description, title
    }
    AuthList.push(Auth)
    if (defaultRole) await Authorization.updateMany({ defaultRole: true }, { defaultRole: false })

    const nAuth = new Authorization({
      role,
      defaultRole,
      AuthList
    })
    await nAuth.save()

    res.status(201).json(ApiResponse.success(newRole, 201, "Authorization role created successfully"));
  } catch (error) {
    console.error("Error reading data:", error);
  }
});
const updateAuthorizationRole = asyncHandler(async (req, res) => {
  const { role, key, description, title, defaultRole } = req.body
  try {
    let AuthList = []
    let Auth = {
      key, description, title
    }
    AuthList.push(Auth)
    if (defaultRole) await Authorization.updateMany({ defaultRole: true }, { defaultRole: false })

    const nAuth = new Authorization({
      role,
      defaultRole,
      AuthList
    })
    await nAuth.save()

    res.status(201).json(ApiResponse.success(newRole, 201, "Authorization role created successfully"));
  } catch (error) {
    console.error("Error reading data:", error);
  }
});
const deleteAuthorizationRole = asyncHandler(async (req, res) => {
  const { role, key, description, title, defaultRole } = req.body
  try {
    let AuthList = []
    let Auth = {
      key, description, title
    }
    AuthList.push(Auth)
    if (defaultRole) await Authorization.updateMany({ defaultRole: true }, { defaultRole: false })

    const nAuth = new Authorization({
      role,
      defaultRole,
      AuthList
    })
    await nAuth.save()

    res.status(201).json(ApiResponse.success(newRole, 201, "Authorization role created successfully"));
  } catch (error) {
    console.error("Error reading data:", error);
  }
});

module.exports = {
  createAuthorization, getAllAuthorizationRoles, getAuthorizationRole, updateAuthorizationRole, deleteAuthorizationRole
};
