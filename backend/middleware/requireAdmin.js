const requireAdmin = (req, res, next) => {
  if (req.isAdmin !== true) {
    return res.status(403).json({
      status: "fail",
      data: {
        title: "Forbidden",
      },
    });
  }

  next();
};

module.exports = requireAdmin;
