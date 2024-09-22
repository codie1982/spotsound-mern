const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const AlbumGallery = require("../models/albumGalleryModel");
const ApiResponse = require("../helpers/response")
// Tüm album galerilerini getirme işlemi
const getAlbumGalleries = asyncHandler(async (req, res) => {
  const albumGalleries = await AlbumGallery.find();

  res.status(200).json(ApiResponse.success(albumGalleries, 200, "Album galleries retrieved successfully"));
});

// Tek bir album galerisi getirme işlemi
const getAlbumGallery = asyncHandler(async (req, res) => {
  const albumGallery = await AlbumGallery.findById(req.params.id);

  if (!albumGallery) {
    return res.status(404).json(ApiResponse.error(404, "Album gallery not found"));
  }

  res.status(200).json(ApiResponse.success(albumGallery, 200, "Album gallery retrieved successfully"));
});

// Yeni album galerisi oluşturma işlemi
const createAlbumGallery = asyncHandler(async (req, res) => {
  const { userid, albumid, images } = req.body;

  // images listesi uploadid kullanarak oluşturuluyor
  const imagesList = images.map(image => ({
    type: image.type || 'internal',
    userid: image.userid || null,
    path: image.path || '',
    uploadid: image.uploadid || null,
  }));

  const albumGallery = await AlbumGallery.create({
    userid,
    albumid,
    images: imagesList
  });

  res.status(201).json(ApiResponse.success(albumGallery, 201, "Album gallery created successfully"));
});

// Album galerisi güncelleme işlemi
const updateAlbumGallery = asyncHandler(async (req, res) => {
  const albumGallery = await AlbumGallery.findById(req.params.id);

  if (!albumGallery) {
    return res.status(404).json(ApiResponse.error(404, "Album gallery not found"));
  }

  // images listesi güncelleniyor
  const updatedImages = req.body.images.map(image => ({
    type: image.type || 'internal',
    userid: image.userid || null,
    path: image.path || '',
    uploadid: image.uploadid || null,
  }));

  const updatedAlbumGallery = await AlbumGallery.findByIdAndUpdate(
    req.params.id,
    {
      userid: req.body.userid || albumGallery.userid,
      albumid: req.body.albumid || albumGallery.albumid,
      images: updatedImages.length ? updatedImages : albumGallery.images
    },
    { new: true } // Güncellenmiş nesneyi döndür
  );

  res.status(200).json(ApiResponse.success(updatedAlbumGallery, 200, "Album gallery updated successfully"));
});

// Album galerisi silme işlemi
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

