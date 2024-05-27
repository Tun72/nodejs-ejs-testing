// const posts = [];
const Post = require("../models/postModel");
const User = require("../models/userModel");

const { validationResult } = require("express-validator");
const fileDelete = require("../utils/fileDelete");

const fs = require("fs");
const pdf = require("pdf-creator-node");
const file_path = require("path");

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
      return User.findByIdAndUpdate(req.user._id, {
        $push: { posts: result._id },
      });
    })
    .then((_) => {
      return res.redirect("/");
    })
    .catch((err) => next(err));
};

exports.renderCreatePage = (req, res) => {
  res.render("add-post", { title: "Add", errorMessage: "" });
};

exports.renderHomePage = (req, res, next) => {
  const pageNumber = +req.query.page || 1;

  const POST_PER_PAGE = 5;
  let totalPostNumber;
  Post.find()
    .countDocuments()
    .then((totalPost) => {
      totalPostNumber = totalPost;
      return Post.find()
        .populate("userId", "username isPremium profileImg")
        .limit(POST_PER_PAGE)
        .skip((pageNumber - 1) * POST_PER_PAGE)
        .sort({ title: 1 });
    })
    .then((posts) => {
      // if (!posts.length) throw new Error("No Posts Available!");

      res.render("home", {
        title: "home",
        posts,
        currentPage: pageNumber,
        hasNext: POST_PER_PAGE * pageNumber < totalPostNumber,
        hasPrev: pageNumber > 1,
        isLogin: req?.session?.isLogin,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  if (!postId) return res.send("ERROR");

  Post.findById(postId)
    .populate("userId")
    .then((post) => {
      if (!post) return res.redirect("/");
      res.render("detail", {
        title: post.title,
        post,
        isOwner: String(req?.user?._id) === String(post.userId._id),
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

exports.deletePost = (req, res, next) => {
  const { postId } = req.params;
  if (!postId) return res.redirect("/");

  Post.findByIdAndDelete(postId)
    .then((result) => {
      fileDelete(result.imgUrl);
      console.log("successfully deleted");
      res.redirect("/");
    })
    .catch((err) => next(err));
};

exports.savePostAsPdf = (req, res, next) => {
  const { id } = req.params;
  const templateUrl = `${file_path.join(
    __dirname,
    "../views/template/template.html"
  )}`;
  const date = new Date();

  const html = fs.readFileSync(templateUrl, "utf-8");
  const options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
    header: {
      height: "45mm",
      contents: '<div style="text-align: center;">From BLOG.IO</div>',
    },
    footer: {
      height: "28mm",
      contents: {
        default: '<p style="color: #444;text-align: center">@codehub.mm</p>', // fallback value
      },
    },
  };

  const pdfSaveUrl = `${file_path.join(
    __dirname,
    "../public/pdf",
    date.getTime() + ".pdf"
  )}`;

  const myURL = req.protocol + "://" + req.get("host");

  Post.findById(id)
    .populate("userId")
    .lean()
    .then((post) => {
      post.imgUrl = myURL + "/" + post.imgUrl;
      const document = {
        html,
        data: {
          postData: post,
        },
        path: pdfSaveUrl,
        type: "",
      };

      return pdf.create(document, options);
    })
    .then((_) => {
      return res.download(pdfSaveUrl);
    })
    .then((_) => {
      fileDelete(pdfSaveUrl);
    })
    .catch((err) => {
      next(err);
    });
};
