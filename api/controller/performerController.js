const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const Performer = require("../models/performerModel");
const Song = require('../models/songModel'); // Song modelini import ediyoruz
const PerformerGallery = require("../models/performerGalleryModel");
const ApiResponse = require("../helpers/response")

// Tüm performans sanatçılarını getirme işlemi
const getPerformers = asyncHandler(async (req, res) => {
  const performers = await Performer.find({ performer_delete: false, performer_active: true }).populate('genres'); // genres alanını doldurur
  let msg = "Performers retrieved successfully";
  if (performers.length == 0) {
    msg = "there is no performer"
  }
  res.status(200).json(ApiResponse.success(200, msg, performers));
});

// Performans sanatçısı, genres, songs, ve gallery bilgilerini getirme işlemi
const getPerformer = asyncHandler(async (req, res) => {
  // Performans sanatçısını bulma
  let performerid = req.params.id
  const performer = await Performer.findById(performerid).populate('genres');

  if (!performer) {
    return res.status(404).json(ApiResponse.error(404, "Performer not found"));
  }
  // Performans sanatçısının galerisini bulma
  const gallery = await PerformerGallery.findOne({ performerid: performer._id });
  // Tüm veriler toplanıyor ve response olarak gönderiliyor
  res.status(200).json(ApiResponse.success({
    performer,
    gallery
  }, 200, "Performer details retrieved successfully"));
});

// Yeni performans sanatçısı ve galerisi oluşturma işlemi
const createPerformer = asyncHandler(async (req, res) => {

  const {
    name,
    sortname,
    bio,
    birthdate,
    gender,
    country,
    genres,
    addedby,
    socialLinks,
    songs,
    // PerformerGallery için gerekli alanlar
    profil,
    cover,
    gallery
  } = req.body;

  // Yeni performer oluşturuluyor
  const performer = await Performer.create({
    name,
    sortname,
    bio,
    birthdate,
    gender,
    country,
    genres,
    addedby,
    socialLinks,
    songs
  });

  // Performer başarıyla oluşturulduktan sonra, PerformerGallery oluşturuluyor
  const performerGallery = await PerformerGallery.create({
    userid: addedby, // Kullanıcı id'si
    performerid: performer._id, // Performans sanatçısının id'si
    profil, // req.body'den gelen profil alanı
    cover,  // req.body'den gelen cover alanı
    gallery // req.body'den gelen gallery alanı
  });

  res.status(201).json(ApiResponse.success({
    performer,
    performerGallery
  }, 201, "Performer and Performer Gallery created successfully"));
});

// Performans sanatçısını güncelleme işlemi
const updatePerformer = asyncHandler(async (req, res) => {
  const performer = await Performer.findById(req.params.id);

  if (!performer) {
    return res.status(404).json(ApiResponse.error(404, "Performer not found"));
  }

  const updatedPerformer = await Performer.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true } // Güncellenmiş nesneyi döndür
  );

  res.status(200).json(ApiResponse.success(updatedPerformer, 200, "Performer updated successfully"));
});

// Performans sanatçısını silme işlemi
const deletePerformer = asyncHandler(async (req, res) => {
  const performer = await Performer.findById(req.params.id);

  if (!performer) {
    return res.status(404).json(ApiResponse.error(404, "Performer not found"));
  }

  await Performer.findByIdAndUpdate(
    req.params.id,
    { performer_delete: true, performer_active: false },
    { new: true } // Güncellenmiş nesneyi döndür
  );

  res.status(200).json(ApiResponse.success({}, 200, "Performer deleted successfully"));
});
// Performans sanatçısını silme işlemi
const forcePerformer = asyncHandler(async (req, res) => {
  const performer = await Performer.findById(req.params.id);

  if (!performer) {
    return res.status(404).json(ApiResponse.error(404, "Performer not found"));
  }

  await performer.remove();

  res.status(200).json(ApiResponse.success({}, 200, "Performer deleted successfully"));
});

//----------Performer GENRE ---------------//
// Performans sanatçısının tüm müzik türlerini getirme işlemi
const getPerformerGenre = asyncHandler(async (req, res) => {
  const performer = await Performer.findById(req.params.id).populate('genres');

  if (!performer) {
    return res.status(404).json(ApiResponse.error(404, "Performer not found"));
  }

  res.status(200).json(ApiResponse.success(performer.genres, 200, "Performer genres retrieved successfully"));
});

// Performans sanatçısına yeni bir müzik türü ekleme işlemi
const addPerformerGenre = asyncHandler(async (req, res) => {
  const performer = await Performer.findById(req.params.id);

  if (!performer) {
    return res.status(404).json(ApiResponse.error(404, "Performer not found"));
  }

  // Eklenmek istenen müzik türü genreid ile geliyor
  const { genreid } = req.body;

  // Eğer müzik türü zaten eklenmişse hata döndür
  if (performer.genres.includes(genreid)) {
    return res.status(400).json(ApiResponse.error(400, "Genre already exists for this performer"));
  }

  // Müzik türünü ekle
  performer.genres.push(genreid);
  await performer.save();

  res.status(200).json(ApiResponse.success(performer.genres, 200, "Genre added to performer successfully"));
});

// Performans sanatçısındaki bir müzik türünü güncelleme işlemi
const updatePerformerGenre = asyncHandler(async (req, res) => {
  const performer = await Performer.findById(req.params.id);

  if (!performer) {
    return res.status(404).json(ApiResponse.error(404, "Performer not found"));
  }

  const { oldGenreid, newGenreid } = req.body;

  // Eğer eski müzik türü performer'da yoksa hata döndür
  if (!performer.genres.includes(oldGenreid)) {
    return res.status(400).json(ApiResponse.error(400, "Old genre does not exist for this performer"));
  }

  // Eski müzik türünü yeni müzik türüyle değiştir
  performer.genres = performer.genres.map(genre => genre.equals(oldGenreid) ? newGenreid : genre);
  await performer.save();

  res.status(200).json(ApiResponse.success(performer.genres, 200, "Performer genre updated successfully"));
});

// Performans sanatçısından bir müzik türü silme işlemi
const removePerformerGenre = asyncHandler(async (req, res) => {
  const performer = await Performer.findById(req.params.id);

  if (!performer) {
    return res.status(404).json(ApiResponse.error(404, "Performer not found"));
  }

  const { genreid } = req.body;

  // Eğer silinmek istenen müzik türü performer'da yoksa hata döndür
  if (!performer.genres.includes(genreid)) {
    return res.status(400).json(ApiResponse.error(400, "Genre does not exist for this performer"));
  }

  // Müzik türünü listeden çıkar
  performer.genres = performer.genres.filter(genre => !genre.equals(genreid));
  await performer.save();

  res.status(200).json(ApiResponse.success(performer.genres, 200, "Performer genre removed successfully"));
});
//----------Performer GENRE ---------------//



//------------Performer Song --------------//
// Performans sanatçısının tüm şarkılarını getirme işlemi
const getPerformerSong = asyncHandler(async (req, res) => {
  const songs = await Song.find({ 'performers.performerid': req.params.id });

  if (!songs || songs.length === 0) {
    return res.status(404).json(ApiResponse.error(404, "No songs found for this performer"));
  }

  res.status(200).json(ApiResponse.success(songs, 200, "Performer songs retrieved successfully"));
});

// Performans sanatçısına yeni bir şarkı ekleme işlemi
const addPerformerSong = asyncHandler(async (req, res) => {
  const { songid } = req.body;

  const song = await Song.findById(songid);
  if (!song) {
    return res.status(404).json(ApiResponse.error(404, "Song not found"));
  }

  if (song.performers.some(p => p.performerid.equals(req.params.id))) {
    return res.status(400).json(ApiResponse.error(400, "Song already exists for this performer"));
  }

  song.performers.push({ performerid: req.params.id });
  await song.save();

  res.status(200).json(ApiResponse.success(song, 200, "Song added to performer successfully"));
});

// Performans sanatçısındaki bir şarkıyı güncelleme işlemi
const updatePerformerSong = asyncHandler(async (req, res) => {
  const { oldSongid, newSongid } = req.body;

  const oldSong = await Song.findById(oldSongid);
  const newSong = await Song.findById(newSongid);

  if (!oldSong || !newSong) {
    return res.status(404).json(ApiResponse.error(404, "Song not found"));
  }

  // Performans sanatçısının eski şarkısını yeni şarkı ile değiştir
  if (oldSong.performers.some(p => p.performerid.equals(req.params.id))) {
    oldSong.performers = oldSong.performers.filter(p => !p.performerid.equals(req.params.id));
    await oldSong.save();

    newSong.performers.push({ performerid: req.params.id });
    await newSong.save();

    res.status(200).json(ApiResponse.success(newSong, 200, "Performer song updated successfully"));
  } else {
    res.status(400).json(ApiResponse.error(400, "Old song does not exist for this performer"));
  }
});

// Performans sanatçısından bir şarkı silme işlemi
const removePerformerSong = asyncHandler(async (req, res) => {
  const { songid } = req.body;

  const song = await Song.findById(songid);

  if (!song || !song.performers.some(p => p.performerid.equals(req.params.id))) {
    return res.status(404).json(ApiResponse.error(404, "Song does not exist for this performer"));
  }

  // Şarkıyı performans sanatçısının listesinden çıkar
  song.performers = song.performers.filter(p => !p.performerid.equals(req.params.id));
  await song.save();

  res.status(200).json(ApiResponse.success(song, 200, "Song removed from performer successfully"));
});

module.exports = {
  getPerformers,
  getPerformer,
  createPerformer,
  updatePerformer,
  deletePerformer,
  forcePerformer,
  getPerformerGenre,
  addPerformerGenre,
  updatePerformerGenre,
  removePerformerGenre,
  getPerformerSong,
  addPerformerSong,
  updatePerformerSong,
  removePerformerSong,
};


