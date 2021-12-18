const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const {
  submitLike,
  deleteLike,
  deleleLikeAdmin,
  getAllLikesOfSinglePost,
} = require("../controllers/likeControllers");

router
  .route("/:id")
  .get(getAllLikesOfSinglePost)
  .post(authenticateUser, submitLike)
  .delete(authenticateUser, deleteLike);
router
  .route("/admin/:id")
  .delete(authenticateUser, authorizePermissions("admin"), deleleLikeAdmin);

module.exports = router;
