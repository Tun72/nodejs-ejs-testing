// const posts = [];
const Post = require("../models/postModel");

exports.createPost = (req, res) => {
  const { title, description, photo } = req.body;
  const post = new Post(title, description, photo);

  post
    .setPost()
    .then((data) => {
      console.log(data);
      res.redirect("/");
    })
    .catch((e) => {
      res.write(e);
    });
  // posts.push({
  //   id: Math.random(),
  //   title,
  //   description,
  //   photo,
  // });
};

exports.renderCreatePage = (req, res) => {
  res.render("add-post", { title: "add" });
};

exports.renderHomePage = (req, res) => {
  // res.sendFile(path.join(__dirname, "..", "views", "homepage.html"));
  Post.getAllPosts()
    .then(([posts]) => {
      // console.log(posts);
      res.render("home", { title: "home", posts });
    })
    .catch((e) => {
      console.log(e);
      return res.send(e.message);
    });
};

exports.getPost = (req, res) => {
  const postId = Number(req.params.postId);

  console.log(postId);
  if (!postId) return res.write("ERROR");

  Post.getSinglePost(postId)
    .then(([post]) => {
      if (post.length === 0) throw new Error("Not Found");
      res.render("detail", { title: "detail", post: post[0] });
    })
    .catch((e) => {
      // console.log(e);
      return res.send(e.message);
    });
};
