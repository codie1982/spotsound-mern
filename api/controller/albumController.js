const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const Album = require("../models/albumModel");
const ApiResponse = require("../helpers/response")

// Tüm albümleri getirme işlemi
const getAlbums = asyncHandler(async (req, res) => {
  const albums = await Album.find().populate('performers.performerid').populate('genres').populate('songs.songid').populate('images.imageid');

  res.status(200).json(ApiResponse.success(albums, 200, "Albums retrieved successfully"));
});

// Tek bir albüm getirme işlemi
const getAlbum = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id).populate('performers.performerid').populate('genres').populate('songs.songid').populate('images.imageid');

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

  res.status(200).json(ApiResponse.success(album, 200, "Album retrieved successfully"));
});

// Yeni albüm oluşturma işlemi
const createAlbum = asyncHandler(async (req, res) => {
  const { title, performers, releaseDate, genres, images, songs, userid, active } = req.body;

  const album = await Album.create({
    title,
    performers,
    releaseDate,
    genres,
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

//----------------------------Genre -----------------//

// Albümün tüm müzik türlerini getirme işlemi
const getAlbumGenre = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id).populate('genres');

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

  res.status(200).json(ApiResponse.success(album.genres, 200, "Album genres retrieved successfully"));
});

// Albüme yeni bir müzik türü ekleme işlemi
const addAlbumGenre = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id);

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

  // Eklenmek istenen müzik türü genreid ile geliyor
  const { genreid } = req.body;

  // Eğer müzik türü zaten eklenmişse hata döndür
  if (album.genres.includes(genreid)) {
    return res.status(400).json(ApiResponse.error(400, "Genre already exists for this album"));
  }

  // Müzik türünü ekle
  album.genres.push(genreid);
  await album.save();

  res.status(200).json(ApiResponse.success(album.genres, 200, "Genre added to album successfully"));
});

// Albümdeki bir müzik türünü güncelleme işlemi
const updateAlbumGenre = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id);

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

  const { oldGenreid, newGenreid } = req.body;

  // Eğer eski müzik türü albümde yoksa hata döndür
  if (!album.genres.includes(oldGenreid)) {
    return res.status(400).json(ApiResponse.error(400, "Old genre does not exist for this album"));
  }

  // Eski müzik türünü yeni müzik türüyle değiştir
  album.genres = album.genres.map(genre => genre.equals(oldGenreid) ? newGenreid : genre);
  await album.save();

  res.status(200).json(ApiResponse.success(album.genres, 200, "Album genre updated successfully"));
});

// Albümden bir müzik türü silme işlemi
const removeAlbumGenre = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id);

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

  const { genreid } = req.body;

  // Eğer silinmek istenen müzik türü albümde yoksa hata döndür
  if (!album.genres.includes(genreid)) {
    return res.status(400).json(ApiResponse.error(400, "Genre does not exist for this album"));
  }

  // Müzik türünü listeden çıkar
  album.genres = album.genres.filter(genre => !genre.equals(genreid));
  await album.save();

  res.status(200).json(ApiResponse.success(album.genres, 200, "Album genre removed successfully"));
});


//------------------- Album Performer -------------------
// Albümün tüm performans sanatçılarını getirme işlemi
const getAlbumPerformer = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id).populate('performers.performerid');

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

  res.status(200).json(ApiResponse.success(album.performers, 200, "Album performers retrieved successfully"));
});

// Albüme yeni bir performans sanatçısı ekleme işlemi
const addAlbumPerformer = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id);

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

  // Eklenmek istenen performans sanatçısı performerid ile geliyor
  const { performerid } = req.body;

  // Eğer performans sanatçısı zaten eklenmişse hata döndür
  if (album.performers.some(performer => performer.performerid.equals(performerid))) {
    return res.status(400).json(ApiResponse.error(400, "Performer already exists for this album"));
  }

  // Performans sanatçısını ekle
  album.performers.push({ performerid });
  await album.save();

  res.status(200).json(ApiResponse.success(album.performers, 200, "Performer added to album successfully"));
});

// Albümdeki bir performans sanatçısını güncelleme işlemi
const updateAlbumPerformer = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id);

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

  const { oldPerformerid, newPerformerid } = req.body;

  // Eğer eski performans sanatçısı albümde yoksa hata döndür
  if (!album.performers.some(performer => performer.performerid.equals(oldPerformerid))) {
    return res.status(400).json(ApiResponse.error(400, "Old performer does not exist for this album"));
  }

  // Eski performans sanatçısını yeni performans sanatçısı ile değiştir
  album.performers = album.performers.map(performer =>
    performer.performerid.equals(oldPerformerid) ? { performerid: newPerformerid } : performer
  );
  await album.save();

  res.status(200).json(ApiResponse.success(album.performers, 200, "Album performer updated successfully"));
});

// Albümden bir performans sanatçısını silme işlemi
const removeAlbumPerformer = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id);

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

  const { performerid } = req.body;

  // Eğer silinmek istenen performans sanatçısı albümde yoksa hata döndür
  if (!album.performers.some(performer => performer.performerid.equals(performerid))) {
    return res.status(400).json(ApiResponse.error(400, "Performer does not exist for this album"));
  }
  // Performans sanatçısını listeden çıkar
  album.performers = album.performers.filter(performer => !performer.performerid.equals(performerid));
  await album.save();
  res.status(200).json(ApiResponse.success(album.performers, 200, "Performer removed from album successfully"));
});


//----------------------- Album Song --------------------
// Albümün tüm şarkılarını getirme işlemi
const getAlbumSong = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id).populate('songs.songid');

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

  res.status(200).json(ApiResponse.success(album.songs, 200, "Album songs retrieved successfully"));
});

// Albüme yeni bir şarkı ekleme işlemi
const addAlbumSong = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id);

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

  // Eklenmek istenen şarkı songid ile geliyor
  const { songid } = req.body;

  // Eğer şarkı zaten eklenmişse hata döndür
  if (album.songs.some(song => song.songid.equals(songid))) {
    return res.status(400).json(ApiResponse.error(400, "Song already exists for this album"));
  }

  // Şarkıyı ekle
  album.songs.push({ songid });
  await album.save();

  res.status(200).json(ApiResponse.success(album.songs, 200, "Song added to album successfully"));
});

// Albümdeki bir şarkıyı güncelleme işlemi
const updateAlbumSong = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id);

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

  const { oldSongid, newSongid } = req.body;

  // Eğer eski şarkı albümde yoksa hata döndür
  if (!album.songs.some(song => song.songid.equals(oldSongid))) {
    return res.status(400).json(ApiResponse.error(400, "Old song does not exist for this album"));
  }

  // Eski şarkıyı yeni şarkı ile değiştir
  album.songs = album.songs.map(song =>
    song.songid.equals(oldSongid) ? { songid: newSongid } : song
  );
  await album.save();

  res.status(200).json(ApiResponse.success(album.songs, 200, "Album song updated successfully"));
});

// Albümden bir şarkıyı silme işlemi
const removeAlbumSong = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id);

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

  const { songid } = req.body;

  // Eğer silinmek istenen şarkı albümde yoksa hata döndür
  if (!album.songs.some(song => song.songid.equals(songid))) {
    return res.status(400).json(ApiResponse.error(400, "Song does not exist for this album"));
  }

  // Şarkıyı listeden çıkar
  album.songs = album.songs.filter(song => !song.songid.equals(songid));
  await album.save();

  res.status(200).json(ApiResponse.success(album.songs, 200, "Song removed from album successfully"));
});

module.exports = {
  getAlbums,
  getAlbum,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  getAlbumGenre,
  addAlbumGenre,
  updateAlbumGenre,
  removeAlbumGenre,
  getAlbumPerformer,
  addAlbumPerformer,
  updateAlbumPerformer,
  removeAlbumPerformer,
  getAlbumSong,
  addAlbumSong,
  updateAlbumSong,
  removeAlbumSong,
};

