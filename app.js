const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const session = require("express-session");
const csrf = require("csurf");
const mongoStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const flash = require("connect-flash");

const bodyParser = require("body-parser");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_MAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

const User = require("./models/userModel");

const postRouter = require("./routes/postRouter");
const adminRouter = require("./routes/adminRouter");
const authRouter = require("./routes/authRouter");

// middleware
const loginMiddleware = require("./middlewares/loginMiddleware");

const store = new mongoStore({
  uri: process.env.MONGODB_URL,
  collection: "sessions",
});

const app = express();
const csrfProtect = csrf();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SECRECT,
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(csrfProtect);
app.use(flash());

app.use((req, res, next) => {
  req.transporter = transporter;
  next();
});

app.use((req, res, next) => {
  if (!req.session.isLogin) return next();
  User.findById(req.session.userInfo._id).then((user) => {
    if (user) req.user = user;
    next();
  });
});

app.use((req, res, next) => {
  res.locals.isLogin = req.session.isLogin || false;
  res.locals.csrfToken = req.csrfToken();

  
  next();
});
app.use("/", postRouter);
app.use("/admin", loginMiddleware.isLogin, adminRouter);
app.use("/auth", authRouter);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URL)
  .then((result) => {
    console.log("database successfully connected ✅");
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:" + PORT);
    });

    return User.findOne().then((user) => {
      if (!user) {
        return User.create({
          username: "admin",
          email: "admin@gmail.com",
          password: "admin123",
        });
      }
      return user;
    });
  })
  .catch((error) => console.log(error));
// .then((result) => {
//   // console.log(result);
// })
