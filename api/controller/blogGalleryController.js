const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const BlogGallery = require("../models/blogGalleryModel");
const ApiResponse = require("../helpers/response")

// Tüm blog galerilerini getirme işlemi
const getBlogGalleries = asyncHandler(async (req, res) => {
  const blogGalleries = await BlogGallery.find();

  res.status(200).json(ApiResponse.success(blogGalleries, 200, "Blog galleries retrieved successfully"));
});

// Tek bir blog galerisi getirme işlemi
const getBlogGallery = asyncHandler(async (req, res) => {
  const blogGallery = await BlogGallery.findById(req.params.id);

  if (!blogGallery) {
    return res.status(404).json(ApiResponse.error(404, "Blog gallery not found"));
  }

  res.status(200).json(ApiResponse.success(blogGallery, 200, "Blog gallery retrieved successfully"));
});

// Yeni blog galerisi oluşturma işlemi
const createBlogGallery = asyncHandler(async (req, res) => {
  const { userid, blogid, images } = req.body;

  // images listesi uploadid kullanarak oluşturuluyor
  const imagesList = images.map(image => ({
    type: image.type || 'internal',
    userid: image.userid || null,
    path: image.path || '',
    uploadid: image.uploadid || null,
  }));

  const blogGallery = await BlogGallery.create({
    userid,
    blogid,
    images: imagesList
  });

  res.status(201).json(ApiResponse.success(blogGallery, 201, "Blog gallery created successfully"));
});

// Blog galerisi güncelleme işlemi
const updateBlogGallery = asyncHandler(async (req, res) => {
  const blogGallery = await BlogGallery.findById(req.params.id);

  if (!blogGallery) {
    return res.status(404).json(ApiResponse.error(404, "Blog gallery not found"));
  }

  // images listesi güncelleniyor
  const updatedImages = req.body.images.map(image => ({
    type: image.type || 'internal',
    userid: image.userid || null,
    path: image.path || '',
    uploadid: image.uploadid || null,
  }));

  const updatedBlogGallery = await BlogGallery.findByIdAndUpdate(
    req.params.id,
    {
      userid: req.body.userid || blogGallery.userid,
      blogid: req.body.blogid || blogGallery.blogid,
      images: updatedImages.length ? updatedImages : blogGallery.images
    },
    { new: true } // Güncellenmiş nesneyi döndür
  );

  res.status(200).json(ApiResponse.success(updatedBlogGallery, 200, "Blog gallery updated successfully"));
});

// Blog galerisi silme işlemi
const deleteBlogGallery = asyncHandler(async (req, res) => {
  const blogGallery = await BlogGallery.findById(req.params.id);

  if (!blogGallery) {
    return res.status(404).json(ApiResponse.error(404, "Blog gallery not found"));
  }

  await blogGallery.remove();

  res.status(200).json(ApiResponse.success({}, 200, "Blog gallery deleted successfully"));
});

module.exports = {
  getBlogGalleries,
  getBlogGallery,
  createBlogGallery,
  updateBlogGallery,
  deleteBlogGallery,
};
