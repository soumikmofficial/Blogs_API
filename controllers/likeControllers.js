const Like = require("../models/Like");
const Blog = require("../models/Blog");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

// TODO: SUBMIT LIKE
const submitLike = async (req, res) => {
  const { id: blogId } = req.params;
  const user = req.user.userId;
  const blog = await Blog.findOne({ _id: blogId });
  if (!blog) {
    throw new CustomError.BadRequestError(
      `Couldn't find a blog with id: ${blogId}`
    );
  }

  const like = await Like.create({ user, blog: blogId });
  res.status(StatusCodes.CREATED).json({ msg: `Like submitted` });
};

// TODO: Delete LIKE
const deleteLike = async (req, res) => {
  const { id: blogId } = req.params;
  const like = await Like.findOne({ blog: blogId, user: req.user.userId });
  if (!like) {
    throw new CustomError.BadRequestError(`Action failed due to bad request`);
  }
  await like.remove();
  res.status(StatusCodes.CREATED).json({ msg: `Like removed` });
};

// TODO: ADMIN LIKE DELETION
const deleleLikeAdmin = async (req, res) => {
  const like = await Like.findOne({ _id: req.params.id });
  if (!like) {
    throw new CustomError.BadRequestError(`Like doesn't exist`);
  }
  await like.remove();
  res.status(StatusCodes.OK).json({ msg: "Like removed" });
};

// TODO: ALL LIKES OF A BLOG POST
const getAllLikesOfSinglePost = async (req, res) => {
  const likes = await Like.find({ blog: req.params.id }).populate({
    path: "user",
    select: "name -_id",
  });
  res.status(StatusCodes.OK).json({ likes });
};

module.exports = {
  submitLike,
  deleteLike,
  deleleLikeAdmin,
  getAllLikesOfSinglePost,
};
