const User = require("../models/userModel");
exports.getLogin = (req, res, next) => {
  return res.render("auth/login", { title: "Login" });
};

exports.postLoginData = (req, res, next) => {
  res.setHeader("Set-Cookie", "isLogIn=true;Secure; HttpOnly; path=/");
  console.log("true");
  res.redirect("/");
};
