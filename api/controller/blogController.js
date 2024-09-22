const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const Blog = require("../models/blogModel");
const ApiResponse = require("../helpers/response")

// Tüm blogları getirme işlemi
const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().populate('author'); // Yazar bilgilerini getirir

  res.status(200).json(ApiResponse.success(blogs, 200, "Blogs retrieved successfully"));
});

// Tek bir blog getirme işlemi
const getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('author');

  if (!blog) {
    return res.status(404).json(ApiResponse.error(404, "Blog not found"));
  }

  res.status(200).json(ApiResponse.success(blog, 200, "Blog retrieved successfully"));
});

// Yeni blog oluşturma işlemi
const createBlog = asyncHandler(async (req, res) => {
  const { title, content, author, category, tags, system, published, publishedAt } = req.body;

  const blog = await Blog.create({
    title,
    content,
    author,
    category,
    tags,
    system,
    published,
    publishedAt
  });

  res.status(201).json(ApiResponse.success(blog, 201, "Blog created successfully"));
});

// Blog güncelleme işlemi
const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json(ApiResponse.error(404, "Blog not found"));
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
    },
    { new: true } // Güncellenmiş nesneyi döndür
  );

  res.status(200).json(ApiResponse.success(updatedBlog, 200, "Blog updated successfully"));
});

// Blog silme işlemi
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json(ApiResponse.error(404, "Blog not found"));
  }

  await blog.remove();

  res.status(200).json(ApiResponse.success({}, 200, "Blog deleted successfully"));
});

module.exports = {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
};



