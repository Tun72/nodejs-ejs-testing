const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config();

const postRouter = require("./routes/postRouter");
const adminRouter = require("./routes/adminRouter");
const authRouter = require("./routes/authRouter");


const User = require("./models/userModel");

const app = express();

const mongoose = require("mongoose");
const { error } = require("console");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  User.find({ username: "admin" }).then((user) => {
    if (user) req.user = user[0];
    next()
  });
});

app.use("/", postRouter);
app.use("/admin", adminRouter);
app.use("/auth", authRouter)

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
  }).catch((error) => console.log(error));
  // .then((result) => {
  //   // console.log(result);
  // })
  
