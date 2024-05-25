const AuthController = require("../controllers/authController");
const { body } = require("express-validator");
const express = require("express");
const User = require("../models/userModel");

const router = express.Router();

router
  .route("/login")
  .get(AuthController.getLogin)
  .post(
    body("email").isEmail().withMessage("Email is invalid"),
    body("password")
      .isLength({ min: 6 })
      .trim()
      .withMessage("Password must atleast 6 characters long"),
    AuthController.postLoginData
  );

router
  .route("/register")
  .get(AuthController.getRegister)
  .post(
    body("email")
      .isEmail()
      .withMessage("Email is invalid")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          console.log(user);
          if (user) return Promise.reject("Email is already exist!");
        });
      }),
    body("password")
      .isLength({ min: 6 })
      .trim()
      .withMessage("Password must atleast 6 characters long"),
    AuthController.postRegisterData
  );

router.route("/logout").get(AuthController.logout);

router
  .route("/reset-password")
  .get(AuthController.renderResetPassword)

  .post(
    body("password")
      .isLength({ min: 6 })
      .trim()
      .withMessage("Password must atleast 6 characters long"),
    body("confPassword")
      .trim()
      .custom((value, { req }) => {
        return req.body.password === value;
      })
      .withMessage("Passwords are not match"),
    AuthController.postResetPassword
  );

router
  .route("/reset-password/:token")
  .get(AuthController.rednerResetPasswordFrom);

router
  .route("/send-reset-token")
  .post(
    body("email").isEmail().withMessage("Email is invalid"),
    AuthController.sentResetLink
  );

router.get("/feedback", AuthController.renderFeedback);
module.exports = router;
