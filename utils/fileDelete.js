const fs = require("fs");
const fileDelete = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw new Error(err.message);
    return console.log("file was deleted");
  });
};

module.exports = fileDelete;
