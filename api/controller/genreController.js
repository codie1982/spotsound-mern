const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const Genre = require("../models/genreModel");
const ApiResponse = require("../helpers/response")
// Tüm genre'ları getirme işlemi
const getGenres = asyncHandler(async (req, res) => {
  const genres = await Genre.find();
  res.status(200).json(ApiResponse.success(genres, 200, "Genres retrieved successfully"));
});

// Tek bir genre getirme işlemi
const getGenre = asyncHandler(async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) {
    return res.status(404).json(ApiResponse.error(404, "Genre not found"));
  }

  res.status(200).json(ApiResponse.success(genre, 200, "Genre retrieved successfully"));
});

// Yeni genre oluşturma işlemi
const createGenre = asyncHandler(async (req, res) => {
  const { title, image } = req.body;

  const genre = await Genre.create({
    title,
    image
  });

  res.status(201).json(ApiResponse.success(genre, 201, "Genre created successfully"));
});

// Genre güncelleme işlemi
const updateGenre = asyncHandler(async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) {
    return res.status(404).json(ApiResponse.error(404, "Genre not found"));
  }

  const updatedGenre = await Genre.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true } // Güncellenmiş nesneyi döndür
  );

  res.status(200).json(ApiResponse.success(updatedGenre, 200, "Genre updated successfully"));
});

// Genre silme işlemi
const deleteGenre = asyncHandler(async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) {
    return res.status(404).json(ApiResponse.error(404, "Genre not found"));
  }

  await genre.remove();

  res.status(200).json(ApiResponse.success({}, 200, "Genre deleted successfully"));
});

module.exports = {
  getGenres,
  getGenre,
  createGenre,
  updateGenre,
  deleteGenre,
};


