const express = require("express");
const router = express.Router();
const doctorController = require("../controller/doctorController");
const verifyJWT = require("../middleware/verifyJWT");
const requireAdmin = require("../middleware/requireAdmin");
const validateObjectId = require("../middleware/validateObjectId");
const photoUpload = require("../middleware/photoUpload");
const asyncHandler = require("../middleware/asyncHandler");
const validateImageFile = require("../middleware/validateImageFile");

router
  .route("/new")
  .post(verifyJWT, requireAdmin, asyncHandler(doctorController.createDoctor));
router
  .route("/doctors")
  .get(verifyJWT, requireAdmin, asyncHandler(doctorController.getAllDoctor));
router
  .route("/doctors/:id")
  .get(
    verifyJWT,
    requireAdmin,
    validateObjectId,
    asyncHandler(doctorController.getDoctorById)
  );
router
  .route("/doctors/:id/patients")
  .get(
    verifyJWT,
    requireAdmin,
    validateObjectId,
    asyncHandler(doctorController.getDoctorPatients)
  );
router.route("/getSpecialties").get(asyncHandler(doctorController.getSpecialties));
router
  .route("/specialty/:specialty")
  .get(asyncHandler(doctorController.getDoctorsBySpecialty));
router
  .route("/doctors/:id/")
  .put(
    verifyJWT,
    requireAdmin,
    validateObjectId,
    asyncHandler(doctorController.updateDoctor)
  );
router
  .route("/doctors/:id/")
  .delete(
    verifyJWT,
    requireAdmin,
    validateObjectId,
    asyncHandler(doctorController.deleteDoctor)
  );
router
  .route("/upload-doctor-image/:id")
  .post(
    verifyJWT,
    requireAdmin,
    validateObjectId,
    photoUpload.single("image"),
    validateImageFile,
    asyncHandler(doctorController.profilePhotoUpload)
  );

module.exports = router;
