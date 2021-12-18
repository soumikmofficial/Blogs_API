const Blog = require("../models/Blog");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

// TODO: GET ALL BLOGS
const getAllBlogs = async (req, res) => {
  const blogs = await Blog.find({});
  res.status(StatusCodes.OK).json({ numOfBlogs: blogs.length, blogs });
};

// TODO: Create Blog
const createBlog = async (req, res) => {
  const author = req.user.userId;
  const { title, content } = req.body;

  if (!title || !content) {
    throw new CustomError.BadRequestError(
      `A blog post must contain both title and body`
    );
  }

  const blog = await Blog.create({ title, content, author });

  res.status(StatusCodes.CREATED).json({ blog });
};

// TODO: GET SINGLE BLOG
const getSingleBlog = async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findOne({ _id: id });
  res.status(StatusCodes.OK).json({ blog });
};

// TODO: GET CURRENT USER'S BLOGS
const getCurrentUserBlogs = async (req, res) => {
  const author = req.user.userId;
  const blogs = await Blog.find({ author });
  if (!blogs) {
    throw new CustomError.BadRequestError(`The author has no blog posts`);
  }
  res.status(StatusCodes.OK).json({ blogs });
};

module.exports = {
  getAllBlogs,
  createBlog,
  getSingleBlog,
  getCurrentUserBlogs,
  getCurrentUserBlogs,
};
