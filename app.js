const express = require("express");
const path = require("path");

// third party
const bodyParser = require("body-parser");

// local
const postRouter = require("./routes/postRouter");
const adminRouter = require("./routes/adminRouter");
const sequelize = require("./utils/database");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", postRouter);
app.use("/admin", adminRouter);

const PORT = process.env.PORT || 3000;

sequelize
  .sync()
  .then((result) => {
    // console.log(result);
    app.listen(PORT, () => {
      console.log("Server is running at http://localhost:" + PORT);
    });
  })
  .catch((err) => console.log(err));
