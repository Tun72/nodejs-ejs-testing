const User = require("../models/userModel");
const AuthController = require("../controllers/authController");
const express = require("express");

const router = express.Router();

router
  .route("/login")
  .get(AuthController.getLogin)
  .post(AuthController.postLoginData);

module.exports = router;
