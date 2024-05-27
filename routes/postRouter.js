const postController = require("../controllers/postController");
const userController = require("../controllers/userController");
const loginMiddleware = require("../middlewares/loginMiddleware");
const premiumMiddleware = require("../middlewares/premiumMiddleware");
const express = require("express");
const router = express.Router();

router.get("/", postController.renderHomePage);
router.get("/profile/:userId", userController.getUserProfile);
router.get("/post/:postId", postController.getPost);
router.get(
  "/save/:id",
  loginMiddleware.isLogin,
  premiumMiddleware.isPremium,
  postController.savePostAsPdf
);

module.exports = router;
