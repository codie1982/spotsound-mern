const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const Album = require("../models/albumModel");
const ApiResponse = require("../helpers/response")

// Tüm albümleri getirme işlemi
const getAlbums = asyncHandler(async (req, res) => {
  const albums = await Album.find();

  res.status(200).json(ApiResponse.success(albums, 200, "Albums retrieved successfully"));
});

// Tek bir albüm getirme işlemi
const getAlbum = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id);

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

  res.status(200).json(ApiResponse.success(album, 200, "Album retrieved successfully"));
});

// Yeni albüm oluşturma işlemi
const createAlbum = asyncHandler(async (req, res) => {
  const { title, performers, releaseDate, genreid, images, songs, userid, active } = req.body;

  const album = await Album.create({
    title,
    performers,
    releaseDate,
    genreid,
    images,
    songs,
    userid,
    active
  });

  res.status(201).json(ApiResponse.success(album, 201, "Album created successfully"));
});

// Albüm güncelleme işlemi
const updateAlbum = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id);

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

  const updatedAlbum = await Album.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true } // Güncellenmiş nesneyi döndür
  );

  res.status(200).json(ApiResponse.success(updatedAlbum, 200, "Album updated successfully"));
});

// Albüm silme işlemi
const deleteAlbum = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id);

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

  await album.remove();

  res.status(200).json(ApiResponse.success({}, 200, "Album deleted successfully"));
});

module.exports = {
  getAlbums, getAlbum, createAlbum, updateAlbum, deleteAlbum
};
