// const db = require("../utils/database");
// module.exports = class Post {
//   constructor(title, description, image_url) {
//     this.title = title;
//     this.description = description;
//     this.image_url = image_url;
//   }

//   setPost() {
//     return db.execute(
//       "INSERT INTO posts (title, description, image_url) VALUES (?,?,?)",
//       [this.title, this.description, this.image_url]
//     );
//   }

//   static getAllPosts() {
//     return db.execute("SELECT * FROM posts");
//   }

//   static getSinglePost(id) {
//     return db.execute("SELECT * FROM posts WHERE posts.id = ?", [id]);
//   }
// };

const { DataTypes } = require("sequelize");

const sequelize = require("../utils/database");


// creating schema
const Post = sequelize.define("post", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imgUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});


module.exports = Post;
