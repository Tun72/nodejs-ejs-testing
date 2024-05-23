const express = require("express");
const path = require("path");

// third party
const bodyParser = require("body-parser");

// local
const postRouter = require("./routes/postRouter");
const adminRouter = require("./routes/adminRouter");
const sequelize = require("./utils/database");

const User = require("./models/userModel");
const Post = require("./models/postModel");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(async (req, res, next) => {
  const user = await User.findByPk(1);
  if (user) req.user = user;
  next();
});
app.use("/", postRouter);
app.use("/admin", adminRouter);

const PORT = process.env.PORT || 3000;

Post.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Post);

sequelize
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "admin", email: "admin@gmail.com" });
    }
    return user;
  })
  .then((result) => {
    app.listen(PORT, () => {
      console.log("Server is running at http://localhost:" + PORT);
    });
  }) // console.log(result);

  .catch((err) => console.log(err));
