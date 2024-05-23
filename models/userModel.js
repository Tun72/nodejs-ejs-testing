const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 6,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, minLength: 6, select: false },
  },
  { timestamp: true }
);

const User = mongoose.model("user", UserSchema);
module.exports = User;
