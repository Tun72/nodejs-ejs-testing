const fs = require("fs");
const fileDelete = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw new Error(err.message);
  });
};

module.exports = fileDelete;
