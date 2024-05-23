const path = require("path");
const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

// /admin/create-post
router.get("/create-post", postController.renderCreatePage);

router.post("/", postController.createPost);

router.post("/post/:postId/delete", postController.deletePost);

router
  .route("/edit/:postId")
  .get(postController.getEditPost)
  .post(postController.updatePost);
module.exports = router;
