const asyncHandler = require("express-async-handler");
const Song = require('../models/songModel'); // Song modelini import ediyoruz
const ApiResponse = require('../helpers/response'); // ApiResponse utility'sini import ediyorsunuz

// Tüm şarkıları getirme işlemi
const getSongs = asyncHandler(async (req, res) => {
  const songs = await Song.find().populate('performers.performerid').populate('genre');
  res.status(200).json(ApiResponse.success(songs, 200, "Songs retrieved successfully"));
});

// Tek bir şarkı getirme işlemi
const getSong = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id).populate('performers.performerid').populate('genre');

  if (!song) {
    return res.status(404).json(ApiResponse.error(404, "Song not found"));
  }
  res.status(200).json(ApiResponse.success(song, 200, "Song retrieved successfully"));
});

// Yeni şarkı oluşturma işlemi
const createSong = asyncHandler(async (req, res) => {
  const { name, uploadid, performers, downloadble,
    streamble, genre, raiting, count, like, hasLyrics } = req.body;

  const song = await Song.create({
    name,
    uploadid,
    performers,
    downloadble,
    streamble,
    genre,
    raiting,
    count,
    like,
    hasLyrics
  });

  res.status(201).json(ApiResponse.success(song, 201, "Song created successfully"));
});

// Şarkı güncelleme işlemi
const updateSong = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id);

  if (!song) {
    return res.status(404).json(ApiResponse.error(404, "Song not found"));
  }

  const updatedSong = await Song.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true } // Güncellenmiş nesneyi döndür
  );

  res.status(200).json(ApiResponse.success(updatedSong, 200, "Song updated successfully"));
});

// Şarkı silme işlemi
const deleteSong = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id);

  if (!song) {
    return res.status(404).json(ApiResponse.error(404, "Song not found"));
  }

  await song.remove();

  res.status(200).json(ApiResponse.success({}, 200, "Song deleted successfully"));
});

module.exports = {
  getSongs,
  getSong,
  createSong,
  updateSong,
  deleteSong,
};
