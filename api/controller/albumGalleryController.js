const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const AlbumGallery = require("../models/albumGalleryModel");
const ApiResponse = require("../helpers/response")

// Tüm albüm galerilerini getirme işlemi
const getAlbumGalleries = asyncHandler(async (req, res) => {
  const albumGalleries = await AlbumGallery.find();

  res.status(200).json(ApiResponse.success(albumGalleries, 200, "Album galleries retrieved successfully"));
});

// Tek bir albüm galerisi getirme işlemi
const getAlbumGallery = asyncHandler(async (req, res) => {
  const albumGallery = await AlbumGallery.findById(req.params.id);

  if (!albumGallery) {
    return res.status(404).json(ApiResponse.error(404, "Album gallery not found"));
  }

  res.status(200).json(ApiResponse.success(albumGallery, 200, "Album gallery retrieved successfully"));
});

// Yeni albüm galerisi oluşturma işlemi
const createAlbumGallery = asyncHandler(async (req, res) => {
  const { userid, albumid, gallery } = req.body;

  const albumGallery = await AlbumGallery.create({
    userid,
    albumid,
    gallery
  });

  res.status(201).json(ApiResponse.success(albumGallery, 201, "Album gallery created successfully"));
});

// Albüm galerisi güncelleme işlemi
const updateAlbumGallery = asyncHandler(async (req, res) => {
  const albumGallery = await AlbumGallery.findById(req.params.id);

  if (!albumGallery) {
    return res.status(404).json(ApiResponse.error(404, "Album gallery not found"));
  }

  const updatedAlbumGallery = await AlbumGallery.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true } // Güncellenmiş nesneyi döndür
  );

  res.status(200).json(ApiResponse.success(updatedAlbumGallery, 200, "Album gallery updated successfully"));
});

// Albüm galerisi silme işlemi
const deleteAlbumGallery = asyncHandler(async (req, res) => {
  const albumGallery = await AlbumGallery.findById(req.params.id);

  if (!albumGallery) {
    return res.status(404).json(ApiResponse.error(404, "Album gallery not found"));
  }

  await albumGallery.remove();

  res.status(200).json(ApiResponse.success({}, 200, "Album gallery deleted successfully"));
});

module.exports = {
  getAlbumGalleries,
  getAlbumGallery,
  createAlbumGallery,
  updateAlbumGallery,
  deleteAlbumGallery,
};
