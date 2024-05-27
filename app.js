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

//contoller
const errorController = require("./controllers/errorController");
// middleware
const loginMiddleware = require("./middlewares/loginMiddleware");
const multer = require("multer");

const store = new mongoStore({
  uri: process.env.MONGODB_URL,
  collection: "sessions",
});

const app = express();
const csrfProtect = csrf();

const storageConfigure = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilterConfigure = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  multer({ storage: storageConfigure, fileFilter: fileFilterConfigure }).single(
    "imgUrl"
  )
);

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
  res.locals.user = req.user;

  next();
});
app.use("/", postRouter);
app.use("/admin", loginMiddleware.isLogin, adminRouter);
app.use("/auth", authRouter);

const PORT = process.env.PORT || 3000;

app.all("*", (req, res) => {
  return res.status(404).render("error/404.ejs", { title: 404 });
});

app.use(errorController.get500Page);

mongoose
  .connect(process.env.MONGODB_URL)
  .then((_) => {
    console.log("database successfully connected ✅");
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:" + PORT);
    });

    // return User.findOne().then((user) => {
    //   if (!user) {
    //     return User.create({
    //       username: "admin",
    //       email: "admin@gmail.com",
    //       password: "admin123",
    //     });
    //   }
    //   return user;
    // });
  })
  .catch((error) => console.log(error));
// .then((result) => {
//   // console.log(result);
// })
