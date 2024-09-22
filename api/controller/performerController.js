const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const Performer = require("../models/performerModel");
const PerformerGalery = require("../models/performerGalleryModel");
const ApiResponse = require("../helpers/response")


// Performer getirme işlemi (tek performer)
const getPerformer = asyncHandler(async (req, res) => {
  const performer = await Performer.findById(req.params.id);

  if (!performer) {
    return res.status(404).json(ApiResponse.error(404, "Performer not found"));
  }

  res.status(200).json(ApiResponse.success(performer, 200, "Performer retrieved successfully"));
});

// Tüm performerlari getirme işlemi
const getPerformers = asyncHandler(async (req, res) => {
  const performers = await Performer.find();

  res.status(200).json(ApiResponse.success(performers, 200, "Performers retrieved successfully"));
});

// Yeni performer oluşturma işlemi
const createPerformer = asyncHandler(async (req, res) => {
  const { name, sortname, bio, birthdate, gender, country, profileImage, addedby, socialLinks } = req.body;

  const performer = await Performer.create({
    name,
    sortname,
    bio,
    birthdate,
    gender,
    country,
    profileImage,
    addedby,
    socialLinks,
  });
  res.status(201).json(ApiResponse.success(performer, 201, "Performer created successfully"));
});

// Performer güncelleme işlemi
const updatePerformer = asyncHandler(async (req, res) => {
  const performer = await Performer.findById(req.params.id);

  if (!performer) {
    return res.status(404).json(ApiResponse.error(404, "Performer not found"));
  }

  // Mevcut verileri güncelle
  const updatedPerformer = await Performer.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true } // Güncellenmiş nesneyi döndür
  );

  res.status(200).json(ApiResponse.success(updatedPerformer, 200, "Performer updated successfully"));
});

// Performer silme işlemi
const deletePerformer = asyncHandler(async (req, res) => {
  const performer = await Performer.findById(req.params.id);

  if (!performer) {
    return res.status(404).json(ApiResponse.error(404, "Performer not found"));
  }

  await performer.remove();

  res.status(200).json(ApiResponse.success({}, 200, "Performer deleted successfully"));
});

module.exports = {
  getPerformer,
  getPerformers,
  createPerformer,
  updatePerformer,
  deletePerformer,
};

