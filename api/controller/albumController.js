const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const Album = require("../models/albumModel");
const Song = require("../models/songModel");
const Performer = require("../models/performerModel");
const ApiResponse = require("../helpers/response");
const { default: mongoose } = require("mongoose");

// Tüm albümleri getirme işlemi
const getAlbums = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Varsayılan sayfa 1
  const limit = parseInt(req.query.limit) || 5; // Varsayılan limit 5

  const totalAlbums = await Album.countDocuments({ delete_album: false, active: true });
  const albums = await Album.find(
    { delete_album: false, active: true }
  )
    .skip((page - 1) * limit) // Sayfalama
    .limit(limit) // Limit
    .populate({ path: 'performers.performerid' })
    .populate({
      path: "genres.genreid", populate: "image"
    })
    .populate('images.imageid')
    .populate('songs.songid');

  res.status(200).json(ApiResponse.success(200, "Albums retrieved successfully",
    {
      totalAlbums, // Toplam albüm sayısı
      currentPage: page,
      totalPages: Math.ceil(totalAlbums / limit),
      albums
    }
  ));
});

// Tek bir albüm getirme işlemi
const getAlbum = asyncHandler(async (req, res) => {
  const albumid = req.query.albumid
  const album = await Album.findById(albumid)
    .populate({ path: 'performers.performerid' })
    .populate({
      path: "genres.genreid", populate: "image"
    })
    .populate('images.imageid')
    .populate('songs.songid');

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

  res.status(200).json(ApiResponse.success(200, "Album retrieved successfully", album));
});

// Yeni albüm oluşturma işlemi
const createAlbum = asyncHandler(async (req, res) => {
  let userid = req.user._id
  const { title, releaseDate, active } = req.body;
  // Performers, Songs ve Images dizilerini dinamik olarak alıyoruz
  const performers = extractArrayFromBody(req.body, 'performers');
  const songs = extractArrayFromBody(req.body, 'songs');
  const images = extractArrayFromBody(req.body, 'images');
  const genres = extractArrayFromBody(req.body, 'genres');
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
  res.status(201).json(ApiResponse.success(201, "Album created successfully", album));
});

// Albüm güncelleme işlemi
const updateAlbum = asyncHandler(async (req, res) => {
  const albumid = req.query.albumid
  const album = await Album.findById(albumid);

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
  const albumid = req.query.albumid
  const album = await Album.findById(albumid);

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

  await album.remove();

  res.status(200).json(ApiResponse.success(200, "Album deleted successfully", {}));
});
// Albüm silme işlemi
const softDeleteAlbum = asyncHandler(async (req, res) => {
  const albumid = req.query.albumid
  const album = await Album.findById(albumid);

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

  await Album.findByIdAndUpdate(
    req.params.id,
    { delete_album: true, active: false }
  );

  res.status(200).json(ApiResponse.success(200, "Album deleted successfully", {}));
});
//----------------------------Genre -----------------//

// Albümün tüm müzik türlerini getirme işlemi
const getAlbumGenre = asyncHandler(async (req, res) => {
  const albumid = req.query.albumid
  const album = await Album.findById(albumid)
    .populate({
      path: 'genres.genreid',  // Genre'yi populate et
      populate: { path: 'image' } // Genre'nin altındaki image'ı da populate et
    });

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

  res.status(200).json(ApiResponse.success(200, "Album genres retrieved successfully", album.genres));
});

// Albüme yeni bir müzik türü ekleme işlemi
const addAlbumGenre = asyncHandler(async (req, res) => {
  let albumid = req.query.albumid
  if (!albumid) return res.status(404).json(ApiResponse.error(404, "Album id not found"));

  const album = await Album.findById(albumid);

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }
  // Eklenmek istenen müzik türü genreid ile geliyor
  const { genreid } = req.body;
  // Eğer müzik türü zaten eklenmişse hata döndür
  for (let i = 0; i < album.genres.length; i++) {
    const existingGenreId = album.genres[i].genreid ? album.genres[i].genreid.toString() : null;
    if (existingGenreId === genreid) {
      return res.status(400).json(ApiResponse.error(400, "Genre already exists for this album"));
    }
  }
  // Müzik türünü ekle
  album.genres.push({ genreid: mongoose.Types.ObjectId(genreid) });
  await album.save();

  res.status(200).json(ApiResponse.success(album.genres, 200, "Genre added to album successfully"));
});

// Albümdeki bir müzik türünü güncelleme işlemi
const updateAlbumGenre = asyncHandler(async (req, res) => {
  let albumid = req.query.albumid
  const album = await Album.findById(albumid);

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

  const { oldGenreid, newGenreid } = req.body;

  // Eğer müzik türü zaten eklenmişse hata döndür
  for (let i = 0; i < album.genres.length; i++) {
    const existingGenreId = album.genres[i].genreid ? album.genres[i].genreid.toString() : null;

    if (existingGenreId !== oldGenreid) {
      return res.status(400).json(ApiResponse.error(400, "Genre already exists for this album"));
    }
  }

  // Eski müzik türünü yeni müzik türüyle değiştir
  album.genres = album.genres.map(genre => genre.equals(oldGenreid) ? newGenreid : genre);
  await album.save();

  res.status(200).json(ApiResponse.success(album.genres, 200, "Album genre updated successfully"));
});

// Albümden bir müzik türü silme işlemi
const removeAlbumGenre = asyncHandler(async (req, res) => {
  let albumid = req.query.albumid;
  let genreid = req.query.genreid
  if (!genreid) {
    return res.status(400).json(ApiResponse.error(400, "Genre ID not provided"));
  }

  // Albüm verisini alıyoruz
  const album = await Album.findById(albumid);
  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

  // genreid'nin albümde olup olmadığını kontrol etme
  let genreExists = false;
  for (let i = 0; i < album.genres.length; i++) {
    const existingGenreId = album.genres[i].genreid ? album.genres[i].genreid.toString() : null;
    if (existingGenreId === genreid) {
      genreExists = true;
      break;
    }
  }

  if (!genreExists) {
    return res.status(400).json(ApiResponse.error(400, "Genre does not exist on this album"));
  }

  // Müzik türünü listeden çıkarıyoruz
  album.genres = album.genres.filter(genre => {
    // Eğer genreid tanımlı değilse veya eşleşiyorsa, diziden çıkar
    if (!genre.genreid || genre.genreid.toString() === genreid) {
      return false; // Bu elemanı diziden çıkar
    }
    // Aksi takdirde dizide tut
    return true;
  });
  await album.save();

  res.status(200).json(ApiResponse.success(200, "Album genre removed successfully", album.genres));
});


//------------------- Album Performer -------------------
// Albümün tüm performans sanatçılarını getirme işlemi
const getAlbumPerformer = asyncHandler(async (req, res) => {
  let albumid = req.query.albumid
  const album = await Album.findById(albumid)
    .populate({
      path: "performers.performerid",
      populate: "songs.songid"
    });

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

  res.status(200).json(ApiResponse.success(200, "Album performers retrieved successfully", album.performers));
});

// Albüme yeni bir performans sanatçısı ekleme işlemi
const addAlbumPerformer = asyncHandler(async (req, res) => {
  let albumid = req.body.albumid
  let performerid = req.body.performerid
  // Eklenmek istenen performans sanatçısı performerid ile geliyor
  const album = await Album.findById(albumid);

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

  const addPerformer = await Performer.findById(performerid)
  if (!addPerformer)
    return res.status(404).json(ApiResponse.error(404, "Performer not found"));

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
  const { albumid, performerid } = req.query;
  const album = await Album.findById(albumid);
  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }



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
  let { albumid } = req.query
  const album = await Album.findById(albumid).populate('songs.songid');

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }
  res.status(200).json(ApiResponse.success(album.songs, 200, "Album songs retrieved successfully"));
});

// Albüme yeni bir şarkı ekleme işlemi
const addAlbumSong = asyncHandler(async (req, res) => {
  let {albumid,songid} = req.body
  const album = await Album.findById(albumid);

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

   const isSong = await Song.findById(songid)
   if(!isSong) return res.status(404).json(ApiResponse.error(404, "Song not found"));
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
  let {albumid,songid} = req.query
  const album = await Album.findById(albumid);

  if (!album) {
    return res.status(404).json(ApiResponse.error(404, "Album not found"));
  }

  // Eğer silinmek istenen şarkı albümde yoksa hata döndür
  if (!album.songs.some(song => song.songid.equals(songid))) {
    return res.status(400).json(ApiResponse.error(400, "Song does not exist for this album"));
  }

  // Şarkıyı listeden çıkar
  album.songs = album.songs.filter(song => !song.songid.equals(songid));
  await album.save();

  res.status(200).json(ApiResponse.success(album.songs, 200, "Song removed from album successfully"));
});
// Dinamik dizileri okuma fonksiyonu
const extractArrayFromBody = (body, fieldName) => {
  const resultArray = [];
  let index = 0;

  while (body[`${fieldName}[${index}][${fieldName.slice(0, -1)}id]`]) {
    resultArray.push({
      [`${fieldName.slice(0, -1)}id`]: body[`${fieldName}[${index}][${fieldName.slice(0, -1)}id]`]
    });
    index++;
  }

  return resultArray;
};
module.exports = {
  getAlbums,
  getAlbum,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  softDeleteAlbum,
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

