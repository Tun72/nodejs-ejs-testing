exports.get500Page = (err, req, res, next) => {
  return res
    .status(500)
    .render("error/500.ejs", { title: "500 Error", error: err.message });
};
