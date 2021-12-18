const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/authentication");

const {
  getAllBlogs,
  createBlog,
  getSingleBlog,
  getCurrentUserBlogs,
} = require("../controllers/blogController");

router.route("/").get(getAllBlogs);
router.route("/").post(authenticateUser, createBlog);
router.route("/my-blogs").get(authenticateUser, getCurrentUserBlogs);
router.route("/:id").get(getSingleBlog);

module.exports = router;
