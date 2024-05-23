// const posts = [];
const Post = require("../models/postModel");

exports.createPost = (req, res) => {
  const { title, description, photo } = req.body;

  req.user
    .createPost({ title, description, imgUrl: photo })
    .then((data) => {
      console.log(data);
      res.redirect("/");
    })
    .catch((e) => {
      res.write(e);
    });
};

exports.renderCreatePage = (req, res) => {
  res.render("add-post", { title: "add" });
};

exports.renderHomePage = (req, res) => {
  Post.findAll({
    order: [["createdAt", "DESC"]],
  })
    .then((posts) => {
      res.render("home", { title: "home", posts });
    })
    .catch((e) => {
      console.log(e);
      return res.send(e.message);
    });
};

exports.getPost = (req, res) => {
  const postId = Number(req.params.postId);

  if (!postId || postId === NaN) return res.send("ERROR");

  // method 1
  // Post.findByPk(postId) (OR)
  //method 2
  Post.findOne({ where: { id: postId } })
    .then((post) => {
      if (!post) throw new Error("Not Found");
      res.render("detail", { title: "detail", post });
    })
    .catch((e) => {
      console.log(e);
      return res.send(e.message);
    });
};

exports.deletePost = (req, res) => {
  const { postId } = req.params;
  Post.findByPk(postId)
    .then((post) => {
      if (!post) throw new Error("ERROR");
      return post.destroy();
    })
    .then((result) => {
      console.log(result);
      return res.redirect("/");
    })
    .catch((e) => {
      console.log(e);
      return res.send(e.message);
    });
  console.log(postId);
};

exports.getOldPost = (req, res) => {
  const { postId } = req.params;

  console.log(postId);
  Post.findByPk(postId)
    .then((post) => {
      if (!post) throw new Error("ERROR");
      res.render("edit-post", { title: "edit", post });
    })
    .catch((e) => {
      console.log(e);
      return res.send(e.message);
    });
};

exports.updatePost = (req, res) => {
  const { postId } = req.params;
  const { title, imgUrl, description } = req.body;
  Post.update({ title, imgUrl, description }, { where: { id: postId } })
    .then((result) => {
      // if (!post) throw new Error("ERROR");
      res.redirect("/");
    })
    .catch((e) => {
      console.log(e);
      return res.send(e.message);
    });
};
