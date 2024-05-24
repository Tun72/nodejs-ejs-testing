const path = require("path");
const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const postMiddleware = require("../middlewares/postMiddleware");

// /admin/create-post
router.get("/create-post", postController.renderCreatePage);

router.post("/", postController.createPost);

router.post(
  "/post/:postId/delete",
  postMiddleware.isUser,
  postController.deletePost
);

router
  .route("/edit/:postId")
  .get(postMiddleware.isUser, postController.getEditPost)
  .post(postMiddleware.isUser, postController.updatePost);

module.exports = router;
