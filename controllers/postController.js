// const posts = [];
const Post = require("../models/postModel");

exports.createPost = (req, res) => {
  console.log(req.user);
  Post.create({ ...req.body, userId: req.user })
    .then((result) => {
      console.log(result);
      return res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.renderCreatePage = (req, res) => {
  res.render("add-post", { title: "add" });
};

exports.renderHomePage = (req, res) => {
  Post.find()

    .populate("userId", "username")
    .sort({ title: 1 })
    .then((posts) => {
      res.render("home", {
        title: "home",
        posts,
        isLogin: req?.session?.isLogin,
      });
    })
    .catch((err) => console.log(err));
};

exports.getPost = (req, res) => {
  const postId = req.params.postId;
  if (!postId) return res.send("ERROR");

  Post.findById(postId)
    .then((post) => {
      if (!post) return res.redirect("/");
      res.render("detail", {
        title: post.title,
        post,
      });
    })
    .catch((err) => {
      res.send(err.message);
      console.log(err);
    });
};

exports.getEditPost = (req, res) => {
  const { postId } = req.params;

  Post.findOne({ _id: postId })
    .then((post) => {
      if (!post) return res.redirect("/");
      res.render("edit-post", { title: post.title, post });
    })
    .catch((err) => console.log(err));
};

exports.updatePost = (req, res) => {
  const { postId } = req.params;

  if (!postId) return res.redirect("/");

  const { title, description, imgUrl } = req.body;

  Post.findByIdAndUpdate(postId, { title, description, imgUrl })
    .then((post) => {
      if (!post) throw new Error("Something Went Wrong");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.deletePost = (req, res) => {
  const { postId } = req.params;
  if (!postId) return res.redirect("/");

  Post.findByIdAndDelete(postId)
    .then((result) => {
      console.log(result);
      console.log("successfully deleted");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};
