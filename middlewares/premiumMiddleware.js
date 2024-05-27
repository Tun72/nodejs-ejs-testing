exports.isPremium = (req, res, next) => {

  console.log(req.user.isPremium);
  if (req.user.isPremium) {
    console.log("hit");
    return next();
  }

  return res.redirect("/");
};
