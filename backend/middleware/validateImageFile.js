const fs = require("fs/promises");

const isPng = (buffer) =>
  buffer.length >= 8 &&
  buffer.subarray(0, 8).equals(
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  );

const isJpeg = (buffer) =>
  buffer.length >= 3 &&
  buffer[0] === 0xff &&
  buffer[1] === 0xd8 &&
  buffer[2] === 0xff;

const isGif = (buffer) =>
  buffer.length >= 6 &&
  (buffer.subarray(0, 6).toString("ascii") === "GIF87a" ||
    buffer.subarray(0, 6).toString("ascii") === "GIF89a");

const isWebp = (buffer) =>
  buffer.length >= 12 &&
  buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
  buffer.subarray(8, 12).toString("ascii") === "WEBP";

const validateImageFile = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const file = await fs.readFile(req.file.path);
    const valid = isPng(file) || isJpeg(file) || isGif(file) || isWebp(file);

    if (!valid) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({
        status: "fail",
        data: {
          title: "Invalid image file",
        },
      });
    }

    return next();
  } catch (error) {
    await fs.unlink(req.file.path).catch(() => {});
    return next(error);
  }
};

module.exports = validateImageFile;
