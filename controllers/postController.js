const posts = [];

exports.createPost = (req, res) => {
  const { title, description, photo } = req.body;
  posts.push({
    id: Math.random(),
    title,
    description,
    photo,
  });
  console.log(title);
  res.redirect("/");
};

exports.renderCreatePage = (req, res) => {
  res.render("add-post", { title: "add" });
};

exports.renderHomePage = (req, res) => {
  // res.sendFile(path.join(__dirname, "..", "views", "homepage.html"));
  res.render("home", { title: "home", posts });
};

exports.getPost = (req, res) => {
  const postId = Number(req.params.postId);
  console.log(postId);
  const post = posts.find((post) => post.id === postId);
  res.render("detail", { title: "detail", post });
};
