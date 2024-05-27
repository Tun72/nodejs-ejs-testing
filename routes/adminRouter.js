const path = require("path");
const express = require("express");
const { body } = require("express-validator");

const router = express.Router();
const postController = require("../controllers/postController");
const userController = require("../controllers/userController");

const postMiddleware = require("../middlewares/postMiddleware");

const premiumMiddleware = require("../middlewares/premiumMiddleware");

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

//  user-profile
router.get("/profile", userController.getUserProfile);

router
  .route("/profile/edit")
  .get(userController.renderUpdateUserName)
  .post(
    body("username")
      .isLength({ min: 5, max: 9 })
      .withMessage("username must between 5 to 9characters long"),
    userController.updateUserName
  );

router.route("/profile/buy-premium").get(userController.renderPremium);

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

// subscription success

router.route("/subscription-success").get(userController.renderSuccessPage);
router.get("/subscription-cancel", userController.cancelSubscription);

router.get("/premium-detail", premiumMiddleware.isPremium,  userController.renderPremiumDetail);

router
  .route("/update-profile-picture")
  .get(premiumMiddleware.isPremium, userController.renderProfilePicture)
  .post(premiumMiddleware.isPremium, userController.savePicture);

module.exports = router;
