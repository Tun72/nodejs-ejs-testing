// const posts = [];
const Post = require("../models/postModel");
const { validationResult } = require("express-validator");
const fileDelete = require("../utils/fileDelete");

const fs = require("fs");
const pdf = require("pdf")
exports.createPost = (req, res) => {
  const errors = validationResult(req);
  const image = req.file;
  if (!errors.isEmpty()) {
    return res.status(422).render("add-post", {
      title: "Add",
      errorMessage: errors.array()[0].msg,
      oldFormData: req.body,
    });
  }

  if (!image) {
    return res.status(422).render("add-post", {
      title: "Add",
      errorMessage: "Image should be png/jpg/jpeg",
      oldFormData: req.body,
    });
  }

  Post.create({ ...req.body, imgUrl: image.path, userId: req.user })
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
      if (!post) throw new Error("Post not found");
      res.render("edit-post", { title: "Edit", post, errorMessage: "" });
    })
    .catch((err) => {
      return next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);

  const image = req.file;

  if (!errors.isEmpty()) {
    return res.status(422).render("edit-post", {
      title: "Edit",
      errorMessage: errors.array()[0].msg,
      oldFormData: req.body,
      post: req.body,
    });
  }
  const { _id, title, description } = req.body;

  Post.findById(_id)
    .then((post) => {
      if (!post) throw new Error("Something Went Wrong");

      if (image) {
        fileDelete(post.imgUrl);
        post.imgUrl = image.path;
      }

      post.title = title;
      post.description = description;
      return post.save();
    })
    .then((_) => {
      res.redirect("/");
    })
    .catch((err) => {
      next(err);
    });
};

exports.deletePost = (req, res) => {
  const { postId } = req.params;
  if (!postId) return res.redirect("/");

  Post.findByIdAndDelete(postId)
    .then((result) => {
      fileDelete(result.imgUrl);
      console.log("successfully deleted");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.savePostAsPdf = (req, res, next) => {

}