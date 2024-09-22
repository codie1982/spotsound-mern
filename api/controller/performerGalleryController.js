const asyncHandler = require("express-async-handler");
const PerformerGallery = require("../models/performerGalleryModel");
const ApiResponse = require("../helpers/response")

const getPerformerGalleries = asyncHandler(async (req, res) => {
  const performerGalleries = await PerformerGallery.find();

  res.status(200).json(ApiResponse.success(performerGalleries, 200, "Performer galleries retrieved successfully"));
});

// Tek bir performer galerisi getirme işlemi
const getPerformerGallery = asyncHandler(async (req, res) => {
  const performerGallery = await PerformerGallery.findById(req.params.id);

  if (!performerGallery) {
    return res.status(404).json(ApiResponse.error(404, "Performer gallery not found"));
  }

  res.status(200).json(ApiResponse.success(performerGallery, 200, "Performer gallery retrieved successfully"));
});

// Yeni performer galerisi oluşturma işlemi
const createPerformerGallery = asyncHandler(async (req, res) => {
  const { userid, performerid, profil, cover, gallery } = req.body;

  const performerGallery = await PerformerGallery.create({
    userid,
    performerid,
    profil,
    cover,
    gallery
  });

  res.status(201).json(ApiResponse.success(performerGallery, 201, "Performer gallery created successfully"));
});

// Performer galerisi güncelleme işlemi
const updatePerformerGallery = asyncHandler(async (req, res) => {
  const performerGallery = await PerformerGallery.findById(req.params.id);

  if (!performerGallery) {
    return res.status(404).json(ApiResponse.error(404, "Performer gallery not found"));
  }

  const updatedPerformerGallery = await PerformerGallery.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true } // Güncellenmiş nesneyi döndür
  );

  res.status(200).json(ApiResponse.success(updatedPerformerGallery, 200, "Performer gallery updated successfully"));
});

// Performer galerisi silme işlemi
const deletePerformerGallery = asyncHandler(async (req, res) => {
  const performerGallery = await PerformerGallery.findById(req.params.id);

  if (!performerGallery) {
    return res.status(404).json(ApiResponse.error(404, "Performer gallery not found"));
  }

  await performerGallery.remove();

  res.status(200).json(ApiResponse.success({}, 200, "Performer gallery deleted successfully"));
});

module.exports = {
  getPerformerGalleries,
  getPerformerGallery,
  createPerformerGallery,
  updatePerformerGallery,
  deletePerformerGallery,
};
