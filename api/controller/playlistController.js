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

//-------------------- SONG ------------------


// Playlist'in tüm şarkılarını getirme işlemi
const getPlaylistSong = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id).populate('songlist.songid');

  if (!playlist) {
    return res.status(404).json(ApiResponse.error(404, "Playlist not found"));
  }

  res.status(200).json(ApiResponse.success(playlist.songlist, 200, "Playlist songs retrieved successfully"));
});

// Playlist'e yeni bir şarkı ekleme işlemi
const addPlaylistSong = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    return res.status(404).json(ApiResponse.error(404, "Playlist not found"));
  }

  // Eklenmek istenen şarkı songid ile geliyor
  const { songid } = req.body;

  // Eğer şarkı zaten eklenmişse hata döndür
  if (playlist.songlist.some(song => song.songid.equals(songid))) {
    return res.status(400).json(ApiResponse.error(400, "Song already exists in this playlist"));
  }

  // Şarkıyı ekle
  playlist.songlist.push({ songid });
  await playlist.save();

  res.status(200).json(ApiResponse.success(playlist.songlist, 200, "Song added to playlist successfully"));
});

// Playlist'teki bir şarkıyı güncelleme işlemi
const updatePlaylistSong = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    return res.status(404).json(ApiResponse.error(404, "Playlist not found"));
  }

  const { oldSongid, newSongid } = req.body;

  // Eğer eski şarkı playlist'te yoksa hata döndür
  if (!playlist.songlist.some(song => song.songid.equals(oldSongid))) {
    return res.status(400).json(ApiResponse.error(400, "Old song does not exist in this playlist"));
  }

  // Eski şarkıyı yeni şarkı ile değiştir
  playlist.songlist = playlist.songlist.map(song =>
    song.songid.equals(oldSongid) ? { songid: newSongid } : song
  );
  await playlist.save();

  res.status(200).json(ApiResponse.success(playlist.songlist, 200, "Playlist song updated successfully"));
});

// Playlist'ten bir şarkıyı silme işlemi
const removePlaylistSong = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    return res.status(404).json(ApiResponse.error(404, "Playlist not found"));
  }

  const { songid } = req.body;

  // Eğer silinmek istenen şarkı playlist'te yoksa hata döndür
  if (!playlist.songlist.some(song => song.songid.equals(songid))) {
    return res.status(400).json(ApiResponse.error(400, "Song does not exist in this playlist"));
  }

  // Şarkıyı listeden çıkar
  playlist.songlist = playlist.songlist.filter(song => !song.songid.equals(songid));
  await playlist.save();

  res.status(200).json(ApiResponse.success(playlist.songlist, 200, "Song removed from playlist successfully"));
});



module.exports = {
  getPlaylists,
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  getPlaylistSong,
  addPlaylistSong,
  updatePlaylistSong,
  removePlaylistSong,
};

