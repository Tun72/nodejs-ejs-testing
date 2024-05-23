const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imgUrl: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "user" },
  },
  { timestamp: true }
);

const Post = mongoose.model("post", productSchema);

module.exports = Post;
