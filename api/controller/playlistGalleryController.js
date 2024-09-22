const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const PlaylistGallery = require("../models/playlistGalleryModel");
const ApiResponse = require("../helpers/response")

// Tüm playlist galerilerini getirme işlemi
const getPlaylistGalleries = asyncHandler(async (req, res) => {
  const playlistGalleries = await PlaylistGallery.find();
  res.status(200).json(ApiResponse.success(playlistGalleries, 200, "Playlist galleries retrieved successfully"));
});

// Tek bir playlist galerisi getirme işlemi
const getPlaylistGallery = asyncHandler(async (req, res) => {
  const playlistGallery = await PlaylistGallery.findById(req.params.id);

  if (!playlistGallery) {
    return res.status(404).json(ApiResponse.error(404, "Playlist gallery not found"));
  }

  res.status(200).json(ApiResponse.success(playlistGallery, 200, "Playlist gallery retrieved successfully"));
});

// Yeni playlist galerisi oluşturma işlemi
const createPlaylistGallery = asyncHandler(async (req, res) => {
  const { userid, playlistid, images } = req.body;

  // images listesi uploadid kullanarak oluşturuluyor
  const imagesList = images.map(image => ({
    type: image.type || 'internal',
    userid: image.userid || null,
    path: image.path || '',
    uploadid: image.uploadid || null,
  }));

  const playlistGallery = await PlaylistGallery.create({
    userid,
    playlistid,
    images: imagesList
  });

  res.status(201).json(ApiResponse.success(playlistGallery, 201, "Playlist gallery created successfully"));
});

// Playlist galerisi güncelleme işlemi
const updatePlaylistGallery = asyncHandler(async (req, res) => {
  const playlistGallery = await PlaylistGallery.findById(req.params.id);

  if (!playlistGallery) {
    return res.status(404).json(ApiResponse.error(404, "Playlist gallery not found"));
  }

  // images listesi güncelleniyor
  const updatedImages = req.body.images.map(image => ({
    type: image.type || 'internal',
    userid: image.userid || null,
    path: image.path || '',
    uploadid: image.uploadid || null,
  }));

  const updatedPlaylistGallery = await PlaylistGallery.findByIdAndUpdate(
    req.params.id,
    {
      userid: req.body.userid || playlistGallery.userid,
      playlistid: req.body.playlistid || playlistGallery.playlistid,
      images: updatedImages.length ? updatedImages : playlistGallery.images
    },
    { new: true } // Güncellenmiş nesneyi döndür
  );

  res.status(200).json(ApiResponse.success(updatedPlaylistGallery, 200, "Playlist gallery updated successfully"));
});

// Playlist galerisi silme işlemi
const deletePlaylistGallery = asyncHandler(async (req, res) => {
  const playlistGallery = await PlaylistGallery.findById(req.params.id);

  if (!playlistGallery) {
    return res.status(404).json(ApiResponse.error(404, "Playlist gallery not found"));
  }

  await playlistGallery.remove();

  res.status(200).json(ApiResponse.success({}, 200, "Playlist gallery deleted successfully"));
});

module.exports = {
  getPlaylistGalleries,
  getPlaylistGallery,
  createPlaylistGallery,
  updatePlaylistGallery,
  deletePlaylistGallery,
};
