const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const AlbumModel = require("../models/albumModel");

const preparedata = require("../config/preparedata")
const getAlbums = asyncHandler(async (req, res) => {
  res.status(200).json(preparedata({ language }, 200, "No Connection"))
});
const getAlbum = asyncHandler(async (req, res) => {
  res.status(200).json(preparedata({ language }, 200, "No Connection"))
});
const setAlbum = asyncHandler(async (req, res) => {
  res.status(200).json(preparedata({ language }, 200, "No Connection"))
});
const updateAlbum = asyncHandler(async (req, res) => {
  res.status(200).json(preparedata({ language }, 200, "No Connection"))
});
const deleteAlbum = asyncHandler(async (req, res) => {
  res.status(200).json(preparedata({ language }, 200, "No Connection"))
});
module.exports = {
  getAlbums, getAlbum, setAlbum, updateAlbum, deleteAlbum
};
