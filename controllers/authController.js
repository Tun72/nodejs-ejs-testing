const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const env = require("dotenv");
env.config();

// render login ans post login
exports.getLogin = (req, res, next) => {
  return res.render("auth/login", {
    title: "Login",
    errorMessage: req.flash("error"),
  });
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

// render register and post register
exports.getRegister = (req, res, next) => {
  return res.render("auth/register", {
    title: "Register",
    errorMessage: req.flash("error"),
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
    .then((user) => {
      console.log(req.transporter);
      req.transporter.sendMail({
        from: process.env.SENDER_MAIL,
        to: user.email,
        subject: "Register Successful",
        html: "<h1>Register account Successful</h1> <p>Login using this email </p>",
      });
      res.redirect("/auth/login");
    })
    .catch((err) => {
      req.flash("error", err.message);
      res.redirect("/auth/register");
    });
  //   req.session.isLogin = true;
  //   res.redirect("/");
};

// logout
exports.logout = (req, res, next) => {
  req.session.destroy((_) => {
    res.redirect("/");
  });
};

// render reset password
exports.renderResetPassword = (req, res, next) => {
  res.render("auth/reset", {
    title: "Reset Password",
    errorMessage: req.flash("error"),
  });
};

exports.postResetPassword = (req, res, next) => {
  const { password, confPassword, userId, token } = req.body;
  let resultUser;
  console.log("hit");
  User.findOne({
    resetToken: token,
    tokenExpireDate: { $gt: Date.now() },
    _id: userId,
  })
    .select("+password")
    .then((user) => {
      if (!user) return res.redirect("/auth/reset-password");
      if (password !== confPassword) throw new Error("Passwords are not match");
      resultUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isMatch) => {
      if (isMatch) {
        throw new Error("Passwords should not  be same with previous password");
      }

      return bcrypt.hash(password, 10);
    })
    .then((hashPassword) => {
      resultUser.password = hashPassword;
      resultUser.resetToken = undefined;
      resultUser.tokenExpireDate = undefined;
      return resultUser.save();
    })
    .then((_) => {
      res.redirect("/auth/login");
    })
    .catch((err) => {
      req.flash("error", err.message);
      return res.redirect("/auth/reset-password/" + token);
    });
};

exports.rednerResetPasswordFrom = (req, res) => {
  const { token } = req.params;

  User.findOne({ resetToken: token, tokenExpireDate: { $gt: Date.now() } })
    .select("token")
    .then((user) => {
      console.log(user);
      if (!user) return res.redirect("/auth/reset-password");

      res.render("auth/new-password", {
        title: "New Password",
        userId: user._id.toString(),
        token,
        errorMessage: req.flash("error"),
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// feedbak
exports.renderFeedback = (req, res, next) => {
  res.render("auth/feedback", { title: "Email Successfully Sent" });
};

// send reset token

exports.sentResetLink = (req, res, next) => {
  const { email } = req.body;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return res.redirect("/reset-password");
    }
    const token = buffer.toString("hex");
    console.log(token);
    User.findOne({ email })
      .select("+resetToken")
      .then((user) => {
        if (!user) throw new Error("Email not found!");
        user.resetToken = token;
        user.tokenExpireDate = Date.now() + 1800000;
        return user.save();
      })
      .then((user) => {
        res.redirect("/auth/feedback");
        req.transporter.sendMail({
          from: process.env.SENDER_MAIL,
          to: user.email,
          subject: "Reset Password",
          html: `<h1>Reset Your Password Now.</h1><p>Click the link to change password 
          <a href='http://localhost:3000/auth/reset-password/${token}'>change password </a>
           </p>`,
        });
      })
      .catch((error) => {
        req.flash("error", error.message);
        res.redirect("/auth/reset-password");
      });
  });
};
