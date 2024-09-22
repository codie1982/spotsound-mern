const UserGenre = require('../models/usergenreModel'); // UserGenre modelini import ediyoruz
const asyncHandler = require('express-async-handler');
const ApiResponse = require('../helpers/response'); // ApiResponse'yi doğru yoldan import ediyoruz

// Tüm kullanıcı müzik türlerini getirme işlemi
const getUserGenres = asyncHandler(async (req, res) => {
  const userGenres = await UserGenre.find().populate('userid').populate('genreid');

  res.status(200).json(ApiResponse.success(userGenres, 200, "User genres retrieved successfully"));
});

// Tek bir kullanıcı müzik türü getirme işlemi
const getUserGenre = asyncHandler(async (req, res) => {
  const userGenre = await UserGenre.findById(req.params.id).populate('userid').populate('genreid');

  if (!userGenre) {
    return res.status(404).json(ApiResponse.error(404, "User genre not found"));
  }

  res.status(200).json(ApiResponse.success(userGenre, 200, "User genre retrieved successfully"));
});

// Yeni kullanıcı müzik türü oluşturma işlemi
const createUserGenre = asyncHandler(async (req, res) => {
  const { userid, genreid, preferenceLevel, favorite } = req.body;

  const userGenre = await UserGenre.create({
    userid,
    genreid,
    preferenceLevel,
    favorite
  });

  res.status(201).json(ApiResponse.success(userGenre, 201, "User genre created successfully"));
});

// Kullanıcı müzik türü güncelleme işlemi
const updateUserGenre = asyncHandler(async (req, res) => {
  const userGenre = await UserGenre.findById(req.params.id);

  if (!userGenre) {
    return res.status(404).json(ApiResponse.error(404, "User genre not found"));
  }

  const updatedUserGenre = await UserGenre.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true } // Güncellenmiş nesneyi döndür
  );

  res.status(200).json(ApiResponse.success(updatedUserGenre, 200, "User genre updated successfully"));
});

// Kullanıcı müzik türü silme işlemi
const deleteUserGenre = asyncHandler(async (req, res) => {
  const userGenre = await UserGenre.findById(req.params.id);

  if (!userGenre) {
    return res.status(404).json(ApiResponse.error(404, "User genre not found"));
  }

  await userGenre.remove();

  res.status(200).json(ApiResponse.success({}, 200, "User genre deleted successfully"));
});

module.exports = {
  getUserGenres,
  getUserGenre,
  createUserGenre,
  updateUserGenre,
  deleteUserGenre,
};
