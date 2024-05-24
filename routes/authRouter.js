const User = require("../models/userModel");
const AuthController = require("../controllers/authController");

const express = require("express");

const router = express.Router();

router
  .route("/login")
  .get(AuthController.getLogin)
  .post(AuthController.postLoginData);

router
  .route("/register")
  .get(AuthController.getRegister)
  .post(AuthController.postRegisterData);

router.route("/logout").get(AuthController.logout);

router
  .route("/reset-password")
  .get(AuthController.renderResetPassword)
  .post(AuthController.postResetPassword);

router
  .route("/reset-password/:token")
  .get(AuthController.rednerResetPasswordFrom);

router.route("/send-reset-token").post(AuthController.sentResetLink);

router.get("/feedback", AuthController.renderFeedback);
module.exports = router;
