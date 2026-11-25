const express = require("express");
const router = express.Router();
const authController = require("../controller/authcontroller");
const asyncHandler = require("../middleware/asyncHandler");
const rateLimit = require("../middleware/rateLimit");

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many authentication attempts",
});

router.route("/register").post(authRateLimit, asyncHandler(authController.register));
router.route("/login").post(authRateLimit, asyncHandler(authController.login));
router.route("/refresh").get(asyncHandler(authController.refresh));
router.route("/logout").post(authController.logout);

module.exports = router;
