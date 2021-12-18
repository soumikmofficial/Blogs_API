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

// TODO: UPDATE BLOG
const updateBlog = async (req, res) => {
  const { id: blogId } = req.params;
  const blog = await Blog.findOne({ _id: blogId });
  if (!blog) {
    throw new CustomError.BadRequestError(
      `Couldn't find any blog with the id of '${blogId}'`
    );
  }
  checkPermissions(req.user, blog.author);
  const updated = await Blog.findOneAndUpdate({ _id: blogId }, req.body, {
    new: true,
  });

  res.status(StatusCodes.OK).json({ success: true, blog: updated });
};

// TODO: Delete BLOG
const deleteBlog = async (req, res) => {
  const { id: blogId } = req.params;
  const blog = await Blog.findOne({ _id: blogId });
  if (!blog) {
    throw new CustomError.BadRequestError(
      `Couldn't find any blog with the id of '${blogId}'`
    );
  }
  checkPermissions(req.user, blog.author);
  await blog.remove();

  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: `Deleted "${blog.title}" successfully` });
};

module.exports = {
  getAllBlogs,
  createBlog,
  getSingleBlog,
  getCurrentUserBlogs,
  getCurrentUserBlogs,
  updateBlog,
  deleteBlog,
};
