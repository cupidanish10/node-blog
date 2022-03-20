const multer = require("multer");
const path = require("path");

// console.log(__dirname);
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: diskStorage,
});

module.exports = upload;
