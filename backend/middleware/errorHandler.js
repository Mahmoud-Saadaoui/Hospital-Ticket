const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({
      status: "fail",
      data: {
        title: "Malformed JSON",
      },
    });
  }

  if (err?.type === "entity.too.large") {
    return res.status(413).json({
      status: "fail",
      data: {
        title: "Request body is too large",
      },
    });
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      status: "fail",
      data: {
        title: err.code === "LIMIT_FILE_SIZE"
          ? "File is too large"
          : err.message,
      },
    });
  }

  if (err?.message === "Unsupported file Format") {
    return res.status(400).json({
      status: "fail",
      data: {
        title: err.message,
      },
    });
  }

  if (err?.name === "ValidationError") {
    return res.status(400).json({
      status: "fail",
      data: {
        title: "Validation failed",
        errors: Object.values(err.errors).map(({ path, message }) => ({
          field: path,
          message,
        })),
      },
    });
  }

  if (err?.name === "CastError") {
    return res.status(400).json({
      status: "fail",
      data: {
        title: "Invalid identifier",
      },
    });
  }

  if (err?.code === 11000) {
    return res.status(409).json({
      status: "fail",
      data: {
        title: "Resource already exists",
      },
    });
  }

  console.error(err);
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};

module.exports = errorHandler;
