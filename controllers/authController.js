const User = require("../models/userModel");
exports.getLogin = (req, res, next) => {
  return res.render("auth/login", { title: "Login" });
};

exports.postLoginData = (req, res, next) => {
  req.session.isLogin = true;
  res.redirect("/");
};

exports.logout = (req, res, next) => {
  req.session.destroy((_) => {
    res.redirect("/");
  });
};
