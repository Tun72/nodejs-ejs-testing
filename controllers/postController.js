// const posts = [];
const Post = require("../models/postModel");

exports.createPost = (req, res) => {
  const { title, description, photo } = req.body;
  
};

exports.renderCreatePage = (req, res) => {
  res.render("add-post", { title: "add" });
};

exports.renderHomePage = (req, res) => {
  // res.sendFile(path.join(__dirname, "..", "views", "homepage.html"));

};

exports.getPost = (req, res) => {
  const postId = Number(req.params.postId);

  if (!postId) return res.write("ERROR");


};
