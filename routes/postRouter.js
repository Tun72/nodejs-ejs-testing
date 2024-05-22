const postController = require("../controllers/postController");
const express = require("express");
const router = express.Router();

router.get("/", postController.renderHomePage);
router.get("/post/:postId", postController.getPost);
module.exports = router;
