const Post = require("../models/postModel");
const User = require("../models/userModel");
const stripe = require("stripe")(
  "sk_test_51PKnBoGdUET7yi55XVWX6HuQqcy6XOaeGp8Qpq3zWlIgUtFhWg8xQdhClL3qu8M9kCzjWWnJ7SrctIfrQXLoxMMw00AzALpfLD"
);

const { validationResult } = require("express-validator");
exports.getUserProfile = (req, res, next) => {
  let totalPostNumber;
  let renderPage = "user/public-profile";
  let currentUser;
  let { userId } = req.params;
  const pageNumber = +req.query.page || 1;

  const POST_PER_PAGE = 5;

  console.log(userId);
  if (!userId) {
    renderPage = "user/profile";
    userId = req.user._id;
  }

  User.findById(userId)
    .populate("posts")
    .then((user) => {
      currentUser = user;
      return user.posts.length;
    })
    .then((length) => {
      console.log(length);
      if (!length)
        return res.render(renderPage, {
          title: "Profile",
          posts: [],
          currentPage: pageNumber,
          hasNext: false,
          hasPrev: false,
          isLogin: req?.session?.isLogin,
          user: currentUser,
        });

      return Post.find({ userId }).countDocuments();
    })
    .then((totalPost) => {
      totalPostNumber = totalPost;
      return Post.find({ userId })
        .populate("userId", "username")
        .limit(POST_PER_PAGE)
        .skip((pageNumber - 1) * POST_PER_PAGE)
        .sort({ title: 1 });
    })
    .then((posts) => {
      res.render(renderPage, {
        title: "Profile",
        posts,
        currentPage: pageNumber,
        hasNext: POST_PER_PAGE * pageNumber < totalPostNumber,
        hasPrev: pageNumber > 1,
        isLogin: req?.session?.isLogin,
        user: currentUser,
      });
    })

    .catch((err) => {
      const error = new Error("User profile not found");
      next(error);
    });
};

exports.renderUpdateUserName = (req, res, next) => {
  res.render("user/edit", { title: "Update Username", errorMessage: "" });
};

exports.updateUserName = (req, res, next) => {
  let { username } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("user/edit", {
      title: "Update Username",
      errorMessage: errors.array()[0].msg,
      oldData: username,
    });
  }

  username = username.replace("@", "");
  User.findById(req.user._id)
    .then((user) => {
      if (!user) throw new Error("user not found!");
      user.username = `@${username}`;
      return user.save();
    })
    .then((_) => {
      res.redirect("/admin/profile");
    })
    .catch((err) => next(err));
};

// premium

const lineItems = [
  {
    price: "price_1PKnyKGdUET7yi55Has1L7VX",
    quantity: 1,
  },
];

exports.renderPremium = (req, res, next) => {
  if (req.user.isPremium) return res.redirect("/admin/premium-detail");
  stripe.checkout.sessions
    .create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "subscription",
      success_url: `${req.protocol}://${req.get(
        "host"
      )}/admin/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get(
        "host"
      )}/admin/subscription-cancel`,
    })
    .then((stripe_session) => {
      res.render("user/premium", {
        title: "Premium",
        errorMessage: "",
        session_id: stripe_session.id,
      });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.renderSuccessPage = (req, res, next) => {
  const session_id = req.query.session_id;
  if (!session_id) {
    return res.redirect("/admin/profile");
  }

  stripe.checkout.sessions
    .retrieve(session_id)
    .then((stripe_session) => {
      return User.find({ payment_session_key: session_id });
    })
    .then((user) => {
      if (user.length) throw new Error("Error Checkout key!");
      return User.findById(req.user._id);
    })
    .then((user) => {
      user.payment_session_key = session_id;
      user.isPremium = true;
      return user.save();
    })
    .then((result) => {
      res.render("user/subscription_success", {
        title: "Subscription Success",
        subscription_id: session_id,
      });
    })
    .catch((err) => next(err));
};

exports.cancelSubscription = (req, res, next) => {
  return res.redirect("/admin/profile/buy-premium");
};
// premium detail

exports.renderPremiumDetail = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      return stripe.checkout.sessions.retrieve(user.payment_session_key);
    })
    .then((stripe_session) => {
      const customer_detail = stripe_session.customer_details;
      return res.render("user/premium_detail", {
        title: "Premium Detail",
        customer_id: stripe_session.customer,
        country: customer_detail.address.country,
        postal_code: customer_detail.email,
        name: customer_detail.name,
        invoice_id: stripe_session.invoice,
        status: stripe_session.payment_status,
      });
    })

    .catch((err) => next(err));
};

// render profile picture

exports.renderProfilePicture = (req, res, next) => {
  res.render("user/edit_profile_picture", {
    title: "Profile Picture",
    errorMessage: "",
  });
};

exports.savePicture = (req, res, next) => {
  const image = req.file;

  if (!image) {
    return res.status(422).render("add-post", {
      title: "Add",
      errorMessage: "Image should be png/jpg/jpeg",
      oldFormData: req.body,
    });
  }

  User.findById(req.user._id)
    .then((user) => {
      user.profileImg = image.path;
      return user.save();
    })
    .then((_) => {
      return res.redirect("/admin/profile");
    })
    .catch((err) => {
      next(err);
    });
};
