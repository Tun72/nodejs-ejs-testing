// const posts = [];
const Post = require("../models/postModel");
const { validationResult } = require("express-validator");
exports.createPost = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("add-post", {
      title: "Add",
      errorMessage: errors.array()[0].msg,
      oldFormData: req.body,
    });
  }
  Post.create({ ...req.body, userId: req.user })
    .then((result) => {
      console.log(result);
      return res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.renderCreatePage = (req, res) => {
  res.render("add-post", { title: "Add", errorMessage: "" });
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

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  if (!postId) return res.send("ERROR");

  Post.findById(postId)
    .then((post) => {
      if (!post) return res.redirect("/");
      res.render("detail", {
        title: post.title,
        post,
        isOwner: String(req?.user?._id) === String(post.userId),
      });
    })
    .catch((err) => {
      console.log(err);
      return next(err);
    });
};

exports.getEditPost = (req, res, next) => {
  const { postId } = req.params;

  Post.findOne({ _id: postId })
    .then((post) => {
      if (!post) throw new Error("Post not found")
      res.render("edit-post", { title: "Edit", post, errorMessage: "" });
    })
    .catch((err) => {
      return next(err);
    });
};

exports.updatePost = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("edit-post", {
      title: "Edit",
      errorMessage: errors.array()[0].msg,
      oldFormData: req.body,
      post: req.body,
    });
  }
  const { _id, title, description, imgUrl } = req.body;

  Post.findByIdAndUpdate(_id, { title, description, imgUrl })
    .then((post) => {
      console.log(post);
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
