const path = require("path");
const fs = require("fs");
const multer = require("multer");

const imageDirectory = path.join(__dirname, "../images");
fs.mkdirSync(imageDirectory, { recursive: true });

//photo Storage
const photoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageDirectory);
  },
  filename: function (req, file, cb) {
    if (file) {
      const safeName = path.basename(file.originalname).replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      );
      cb(null, `${Date.now()}-${safeName}`);
    } else {
      cb(null, false);
    }
  },
});

//middleware

const photoUpload = multer({
  storage: photoStorage,
  fileFilter: function (rrq, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb({ message: "Unsupported file Format" }, false);
    }
  },
  limits: { fileSize: 1024 * 1024 }, // 1mb
});

module.exports = photoUpload;
