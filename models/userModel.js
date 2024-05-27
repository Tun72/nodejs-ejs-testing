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
      maxLength: 10,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, minLength: 6, select: false },
    profileImg: { type: String },
    resetToken: { type: String, select: false },
    tokenExpireDate: { type: Date },
    isPremium: {
      type: Boolean,
      default: false,
    },
    payment_session_key: String,
    posts: [{ type: Schema.Types.ObjectId, ref: "post" }],
  },
  { timestamp: true }
);

const User = mongoose.model("user", UserSchema);
module.exports = User;
