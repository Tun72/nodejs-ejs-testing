const path = require("path");
const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

// /admin/create-post
router.get("/create-post", postController.renderCreatePage);

router.post("/create-post", postController.createPost);

router.post("/post/:postId/delete", postController.deletePost);

router
  .route("/post/:postId/edit")
  .get(postController.getOldPost)
  .patch(postController.updatePost);

module.exports = router;
