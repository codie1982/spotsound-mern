const asyncHandler = require("express-async-handler");
const Favorite = require('../models/favoriteModel'); // Song modelini import ediyoruz
const ApiResponse = require('../helpers/response'); // ApiResponse utility'sini import ediyorsunuz
const Album = require('../models/albumModel');
const Performer = require('../models/performerModel');
const Song = require('../models/songModel');

// Kullanıcının favoriye aldığı içerikleri getirme işlemi
const getFavorites = asyncHandler(async (req, res) => {
  const { userid } = req.params;

  // Kullanıcının favorilerine bak
  const favorites = await Favorite.find({ userid });

  if (!favorites || favorites.length === 0) {
    return res.status(404).json(ApiResponse.error(404, "No favorites found for this user"));
  }

  // Albümler, performans sanatçıları ve şarkılar için boş array'ler
  const favoriteAlbums = [];
  const favoritePerformers = [];
  const favoriteSongs = [];

  // Favori içerikleri ayırma
  for (const favorite of favorites) {
    if (favorite.favoriteType === 'album') {
      const album = await Album.findById(favorite.album);
      if (album) favoriteAlbums.push(album);
    } else if (favorite.favoriteType === 'performer') {
      const performer = await Performer.findById(favorite.performer);
      if (performer) favoritePerformers.push(performer);
    } else if (favorite.favoriteType === 'song') {
      const song = await Song.findById(favorite.song);
      if (song) favoriteSongs.push(song);
    }
  }

  res.status(200).json(ApiResponse.success({
    albums: favoriteAlbums,
    performers: favoritePerformers,
    songs: favoriteSongs
  }, 200, "Favorites retrieved successfully"));
});

// Yeni favori oluşturma işlemi
const createFavorite = asyncHandler(async (req, res) => {
  const { userid, favoriteType, album, performer, song } = req.body;

  // Favori tipine göre doğrulama
  if (favoriteType === 'album' && !album) {
    return res.status(400).json(ApiResponse.error(400, "Album id is required"));
  }
  if (favoriteType === 'performer' && !performer) {
    return res.status(400).json(ApiResponse.error(400, "Performer id is required"));
  }
  if (favoriteType === 'song' && !song) {
    return res.status(400).json(ApiResponse.error(400, "Song id is required"));
  }

  // Aynı içeriğin tekrar favoriye eklenip eklenmediğini kontrol et
  const existingFavorite = await Favorite.findOne({
    userid,
    favoriteType,
    [favoriteType]: req.body[favoriteType]
  });

  if (existingFavorite) {
    return res.status(400).json(ApiResponse.error(400, "This content is already in your favorites"));
  }

  // Favoriyi oluştur
  const favorite = await Favorite.create({
    userid,
    favoriteType,
    album: favoriteType === 'album' ? album : null,
    performer: favoriteType === 'performer' ? performer : null,
    song: favoriteType === 'song' ? song : null
  });

  res.status(201).json(ApiResponse.success(favorite, 201, "Favorite added successfully"));
});

// Favoriyi silme işlemi
const deleteFavorite = asyncHandler(async (req, res) => {
  const { userid, favoriteType, albumid, performerid, songid } = req.body;

  // Favoriyi türüne göre bulma ve silme işlemi
  let query = {
    userid,
    favoriteType,
  };

  if (favoriteType === 'album') {
    query.album = albumid;
  } else if (favoriteType === 'performer') {
    query.performer = performerid;
  } else if (favoriteType === 'song') {
    query.song = songid;
  } else {
    return res.status(400).json(ApiResponse.error(400, "Invalid favorite type"));
  }

  const favorite = await Favorite.findOneAndDelete(query);

  if (!favorite) {
    return res.status(404).json(ApiResponse.error(404, "Favorite not found"));
  }

  res.status(200).json(ApiResponse.success({}, 200, "Favorite deleted successfully"));
});
// Bir içeriğin favori olup olmadığını kontrol etme işlemi
const isFavorite = asyncHandler(async (req, res) => {
  const { userid, favoriteType, album, performer, song } = req.body;

  const favorite = await Favorite.findOne({
    userid,
    favoriteType,
    album: favoriteType === 'album' ? album : null,
    performer: favoriteType === 'performer' ? performer : null,
    song: favoriteType === 'song' ? song : null
  });

  if (!favorite) {
    return res.status(404).json(ApiResponse.error(404, "This content is not in your favorites"));
  }

  res.status(200).json(ApiResponse.success(true, 200, "This content is in your favorites"));
});
const toggleFavorite = asyncHandler(async (req, res) => {
  const { userid, favoriteType, albumid, performerid, songid } = req.body;

  // Favoriyi türüne göre bulma
  let query = {
    userid,
    favoriteType,
  };

  if (favoriteType === 'album') {
    query.album = albumid;
  } else if (favoriteType === 'performer') {
    query.performer = performerid;
  } else if (favoriteType === 'song') {
    query.song = songid;
  } else {
    return res.status(400).json(ApiResponse.error(400, "Invalid favorite type"));
  }

  // İçerik favorilerdeyse sil, yoksa ekle
  const existingFavorite = await Favorite.findOne(query);

  if (existingFavorite) {
    await Favorite.findOneAndDelete(query);
    return res.status(200).json(ApiResponse.success({}, 200, "Content removed from favorites"));
  } else {
    const newFavorite = await Favorite.create({
      userid,
      favoriteType,
      album: favoriteType === 'album' ? albumid : null,
      performer: favoriteType === 'performer' ? performerid : null,
      song: favoriteType === 'song' ? songid : null
    });

    return res.status(201).json(ApiResponse.success(newFavorite, 201, "Content added to favorites"));
  }
});
module.exports = {
  getFavorites,
  createFavorite,
  deleteFavorite,
  isFavorite,
  toggleFavorite
};
