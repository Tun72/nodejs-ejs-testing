const Post = require("../models/postModel");

exports.isUser = (req, res, next) => {
  const { postId } = req.params;
  Post.findById(postId)
    .then((post) => {
      if (!post.userId) return res.redirect("/");

      if (String(post?.userId) === String(req?.user?._id)) return next();
      return res.redirect("/");
    })
    .catch((err) => console.log(err));
};
