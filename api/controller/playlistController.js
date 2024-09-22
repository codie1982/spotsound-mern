const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const Playlist = require("../models/playlistModel");
const ApiResponse = require("../helpers/response")

// Tüm playlistleri getirme işlemi
const getPlaylists = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find();

  res.status(200).json(ApiResponse.success(playlists, 200, "Playlists retrieved successfully"));
});

// Tek bir playlist getirme işlemi
const getPlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    return res.status(404).json(ApiResponse.error(404, "Playlist not found"));
  }

  res.status(200).json(ApiResponse.success(playlist, 200, "Playlist retrieved successfully"));
});

// Yeni playlist oluşturma işlemi
const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description, createdBy, songlist, active } = req.body;

  const playlist = await Playlist.create({
    name,
    description,
    createdBy,
    songlist,
    active,
  });

  res.status(201).json(ApiResponse.success(playlist, 201, "Playlist created successfully"));
});

// Playlist güncelleme işlemi
const updatePlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    return res.status(404).json(ApiResponse.error(404, "Playlist not found"));
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true } // Güncellenmiş nesneyi döndür
  );

  res.status(200).json(ApiResponse.success(updatedPlaylist, 200, "Playlist updated successfully"));
});

// Playlist silme işlemi
const deletePlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    return res.status(404).json(ApiResponse.error(404, "Playlist not found"));
  }

  await playlist.remove();

  res.status(200).json(ApiResponse.success({}, 200, "Playlist deleted successfully"));
});

module.exports = {
  getPlaylists,
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
};

