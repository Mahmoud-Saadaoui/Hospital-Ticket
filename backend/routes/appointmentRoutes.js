const express = require("express");
const router = express.Router();
const appointmentController = require("../controller/appointmentController");
const verifyJWT = require("../middleware/verifyJWT");
const requireAdmin = require("../middleware/requireAdmin");
const validateObjectId = require("../middleware/validateObjectId");
const generateBarcode = require("../middleware/generateBarcode");
const asyncHandler = require("../middleware/asyncHandler");

router.use(verifyJWT);
router
  .route("/new")
  .post(
    asyncHandler(generateBarcode),
    asyncHandler(appointmentController.createAppointment)
  );
router
  .route("/")
  .get(requireAdmin, asyncHandler(appointmentController.getAllAppointment));
router
  .route("/:id")
  .get(
    validateObjectId,
    asyncHandler(appointmentController.getPatientAppointments)
  );
router
  .route("/:id")
  .delete(
    validateObjectId,
    asyncHandler(appointmentController.cancelAppointments)
  );

module.exports = router;
