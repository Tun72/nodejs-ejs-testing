const User = require("../models/userModel");
const bcrypt = require("bcrypt");
exports.getLogin = (req, res, next) => {
  return res.render("auth/login", {
    title: "Login",
    errorMessage: req.flash("error"),
  });
};

exports.getRegister = (req, res, next) => {
  return res.render("auth/register", { title: "Register" });
};

exports.postLoginData = (req, res, next) => {
  const { email, password } = req.body;
  let userInfo;
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) throw new Error("Auth Error!User Not Exit Please Register!");
      userInfo = user;
      console.log(user);
      console.log(password);
      return bcrypt.compare(password, user.password);
    })
    .then((isMatch) => {
      console.log(isMatch);
      if (!isMatch) throw new Error("Auth Error!");

      req.session.isLogin = true;
      req.session.userInfo = userInfo;
      return req.session.save((err) => {
        res.redirect("/");
      });
    })
    .catch((err) => {
      req.flash("error", err.message);
      res.redirect("/auth/login");
    });
};

exports.postRegisterData = (req, res, next) => {
  const { email, username, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) throw new Error("Auth Error !User Already Exit!");

      return bcrypt.hash(password, 10);
    })
    .then((result) => {
      console.log(result);
      return User.create({
        username,
        email,
        password: result,
      });
    })
    .then(() => res.redirect("/auth/login"))
    .catch((err) => {
      req.flash("error", err.message);
      res.redirect("/auth/login");
    });
  //   req.session.isLogin = true;
  //   res.redirect("/");
};

exports.logout = (req, res, next) => {
  req.session.destroy((_) => {
    res.redirect("/");
  });
};
