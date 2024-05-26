const path = require("path");
const express = require("express");
const { body } = require("express-validator");

const router = express.Router();
const postController = require("../controllers/postController");
const postMiddleware = require("../middlewares/postMiddleware");

// /admin/create-post
router.get("/create-post", postController.renderCreatePage);

router.post(
  "/",
  [
    body("title")
      .isLength({ min: 10 })
      .withMessage("title must be at least 10 characters long"),
    body("description")
      .isLength({ min: 30 })
      .withMessage("description must be at least 30 characters long"),
  ],

  postController.createPost
);

router.post(
  "/post/:postId/delete",
  postMiddleware.isUser,
  postController.deletePost
);

router
  .route("/edit/:postId")
  .get(postMiddleware.isUser, postController.getEditPost)
  .post(
    postMiddleware.isUser,
    [
      body("title")
        .isLength({ min: 10 })
        .withMessage("title must be at least 10 characters long"),
      body("description")
        .isLength({ min: 30 })
        .withMessage("description must be at least 30 characters long"),
    ],
    postController.updatePost
  );

module.exports = router;
