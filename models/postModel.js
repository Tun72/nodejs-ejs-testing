const { getDatabase } = require("../utils/database");
const ObjectId = require("mongodb").ObjectId;
class Post {
  constructor(title, description, imgUrl, id=null) {
    this._id = id ? new ObjectId(id) : null;
    this.title = title;
    this.description = description;
    this.imgUrl = imgUrl;
  }

  create() {
    const db = getDatabase();
    let dbTmp;
    if (this._id) {
      console.log("hit");
      dbTmp = db
        .collection("posts")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbTmp = db.collection("posts").insertOne(this);
    }
    return dbTmp
      .then((result) => {
        return result;
      })
      .catch((err) => console.log(err));
  }

  static getPosts() {
    const db = getDatabase();
    return db
      .collection("posts", {locale: "en", caseLevel: true})
      .find().sort({createdAt: 1})
      .toArray()
      .then((posts) => {
        console.log(posts);
        return posts;
      })
      .catch((err) => console.log(err));
  }

  static getSinglePost(id) {
    const db = getDatabase();
    return db
      .collection("posts")
      .find({ _id: ObjectId.createFromHexString(id) })
      .next()
      .then((post) => {
        return post;
      })
      .catch((err) => console.log(err));
  }

  static deletePost(id) {
    const db = getDatabase();
    return db
      .collection("posts")
      .deleteOne({ _id: ObjectId.createFromHexString(id) })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Post;
