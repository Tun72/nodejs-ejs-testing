const fs = require("fs");
const fileDelete = (path) => {
  if (fs.existsSync(psth)) {
    fs.unlink(path, (err) => {
      if (err) throw new Error(err.message);
      return console.log("file was deleted");
    });
  }
};

module.exports = fileDelete;
