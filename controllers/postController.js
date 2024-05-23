// const posts = [];
const Post = require("../models/postModel");

exports.createPost = (req, res) => {
  const { title, description, imgUrl } = req.body;

  const post = new Post(title, description, imgUrl);
  post
    .create()
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
  // res.sendFile(path.join(__dirname, "..", "views", "homepage.html"));
  Post.getPosts()
    .then((posts) => {
      res.render("home", { title: "home", posts });
    })
    .catch((err) => console.log(err));
};

exports.getPost = (req, res) => {
  const postId = req.params.postId;
  if (!postId) return res.write("ERROR");

  Post.getSinglePost(postId)
    .then((post) => {
      if (!post) return res.redirect("/");
      res.render("detail", { title: post.title, post });
    })
    .catch((err) => console.log(err));
};

exports.getEditPost = (req, res) => {
  const { postId } = req.params;
  Post.getSinglePost(postId)
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

  const post = new Post(title, description, imgUrl,postId);
  post
    .create()
    .then((post) => {
      if (!post) throw new Error("Something Went Wrong");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.deletePost = (req, res) => {
  const { postId } = req.params;
  if (!postId) return res.redirect("/");

  Post.deletePost(postId)
    .then(() => {
      console.log("successfully deleted");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};
