const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const verifyJWT = require("../middleware/verifyJWT");
const requireAdmin = require("../middleware/requireAdmin");
const validateObjectId = require("../middleware/validateObjectId");
const photoUpload = require("../middleware/photoUpload");
const asyncHandler = require("../middleware/asyncHandler");
const validateImageFile = require("../middleware/validateImageFile");

router.use(verifyJWT);
router.route("/").get(requireAdmin, asyncHandler(userController.getAllUsers));
// router.use(validateObjectId);
router
  .route("/:id")
  .get(validateObjectId, requireAdmin, asyncHandler(userController.getUser));
router
  .route("/:id")
  .put(validateObjectId, asyncHandler(userController.updateUser));
router
  .route("/:id")
  .delete(
    validateObjectId,
    requireAdmin,
    asyncHandler(userController.deleteUser)
  );
router
  .route("/upload-user-image")
  .post(
    photoUpload.single("image"),
    validateImageFile,
    asyncHandler(userController.profilePhotoUpload)
  );

module.exports = router;
