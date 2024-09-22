const asyncHandler = require("express-async-handler");
const Offline = require('../models/offlineModel'); // Song modelini import ediyoruz
const ApiResponse = require('../helpers/response'); // ApiResponse utility'sini import ediyorsunuz
const Album = require('../models/albumModel');
const Performer = require('../models/performerModel');
const Song = require('../models/songModel');

// Kullanıcının offline içeriklerini getirme işlemi
const getOfflineContent = asyncHandler(async (req, res) => {
  const { userid } = req.params;

  const offlineContent = await Offline.find({ userid });

  if (!offlineContent || offlineContent.length === 0) {
    return res.status(404).json(ApiResponse.error(404, "No offline content found for this user"));
  }

  res.status(200).json(ApiResponse.success(offlineContent, 200, "Offline content retrieved successfully"));
});

// Yeni offline içerik ekleme işlemi
const createOfflineContent = asyncHandler(async (req, res) => {
  const { userid, offlineType, albumid, performerid, songid, storagePath } = req.body;

  if (!storagePath) {
    return res.status(400).json(ApiResponse.error(400, "Storage path is required"));
  }

  const offlineContent = await Offline.create({
    userid,
    offlineType,
    album: offlineType === 'album' ? albumid : null,
    performer: offlineType === 'performer' ? performerid : null,
    song: offlineType === 'song' ? songid : null,
    storagePath,
    isAvailableOffline: true,
  });

  res.status(201).json(ApiResponse.success(offlineContent, 201, "Offline content added successfully"));
});

// Offline içeriği güncelleme işlemi
const updateOfflineContent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const offlineContent = await Offline.findById(id);

  if (!offlineContent) {
    return res.status(404).json(ApiResponse.error(404, "Offline content not found"));
  }

  const updatedContent = await Offline.findByIdAndUpdate(id, req.body, { new: true });

  res.status(200).json(ApiResponse.success(updatedContent, 200, "Offline content updated successfully"));
});

// Offline içeriği silme işlemi
const deleteOfflineContent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const offlineContent = await Offline.findById(id);

  if (!offlineContent) {
    return res.status(404).json(ApiResponse.error(404, "Offline content not found"));
  }

  await offlineContent.remove();

  res.status(200).json(ApiResponse.success({}, 200, "Offline content deleted successfully"));
});



// Offline Performer ekleme işlemi
const addOfflinePerformer = asyncHandler(async (req, res) => {
  const { userid, performerid, storagePath } = req.body;

  const offlineContent = await Offline.create({
    userid,
    offlineType: 'performer',
    performer: performerid,
    storagePath,
    isAvailableOffline: true,
  });

  res.status(201).json(ApiResponse.success(offlineContent, 201, "Offline performer added successfully"));
});

// Offline Song ekleme işlemi
const addOfflineSong = asyncHandler(async (req, res) => {
  const { userid, songid, storagePath } = req.body;

  const offlineContent = await Offline.create({
    userid,
    offlineType: 'song',
    song: songid,
    storagePath,
    isAvailableOffline: true,
  });

  res.status(201).json(ApiResponse.success(offlineContent, 201, "Offline song added successfully"));
});

// Offline Album ekleme işlemi
const addOfflineAlbum = asyncHandler(async (req, res) => {
  const { userid, albumid, storagePath } = req.body;

  const offlineContent = await Offline.create({
    userid,
    offlineType: 'album',
    album: albumid,
    storagePath,
    isAvailableOffline: true,
  });

  res.status(201).json(ApiResponse.success(offlineContent, 201, "Offline album added successfully"));
});

// Offline Performer silme işlemi
const removeOfflinePerformer = asyncHandler(async (req, res) => {
  const { userid, performerid } = req.body;

  const offlineContent = await Offline.findOneAndDelete({
    userid,
    offlineType: 'performer',
    performer: performerid,
  });

  if (!offlineContent) {
    return res.status(404).json(ApiResponse.error(404, "Offline performer not found"));
  }

  res.status(200).json(ApiResponse.success({}, 200, "Offline performer removed successfully"));
});

// Offline Song silme işlemi
const removeOfflineSong = asyncHandler(async (req, res) => {
  const { userid, songid } = req.body;

  const offlineContent = await Offline.findOneAndDelete({
    userid,
    offlineType: 'song',
    song: songid,
  });

  if (!offlineContent) {
    return res.status(404).json(ApiResponse.error(404, "Offline song not found"));
  }

  res.status(200).json(ApiResponse.success({}, 200, "Offline song removed successfully"));
});

// Offline Album silme işlemi
const removeOfflineAlbum = asyncHandler(async (req, res) => {
  const { userid, albumid } = req.body;

  const offlineContent = await Offline.findOneAndDelete({
    userid,
    offlineType: 'album',
    album: albumid,
  });

  if (!offlineContent) {
    return res.status(404).json(ApiResponse.error(404, "Offline album not found"));
  }

  res.status(200).json(ApiResponse.success({}, 200, "Offline album removed successfully"));
});

module.exports = {
  getOfflineContent,
  createOfflineContent,
  updateOfflineContent,
  deleteOfflineContent,
  addOfflinePerformer,
  addOfflineSong,
  addOfflineAlbum,
  removeOfflinePerformer,
  removeOfflineSong,
  removeOfflineAlbum,
};

