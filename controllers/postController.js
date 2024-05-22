// const posts = [];
const Post = require("../models/postModel");

exports.createPost = (req, res) => {
  const { title, description, photo } = req.body;
  // const post = new Post(title, description, photo);
  // post
  //   .setPost()
  //   .then((data) => {
  //     console.log(data);
  //     res.redirect("/");
  //   })
  //   .catch((e) => {
  //     res.write(e);
  //   });

  Post.create({ title, description, imgUrl: photo })
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
  Post.findAll()
    .then((posts) => {
      res.render("home", { title: "home", posts });
    })
    .catch((e) => {
      console.log(e);
      return res.send(e.message);
    });
  // Post.getAllPosts()
  //   .then(([posts]) => {
  //     // console.log(posts);
  //     res.render("home", { title: "home", posts });
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //     return res.send(e.message);
  //   });
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

  // Post.getSinglePost(postId)
  //   .then(([post]) => {
  //     console.log(post);
  //     if (post.length === 0) throw new Error("Not Found");
  //     res.render("detail", { title: "detail", post: post[0] });
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //     return res.send(e.message);
  //   });
};
