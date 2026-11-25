const mongoose = require("mongoose");
const User = require("./User");
const Doctor = require("./Doctor");

const appointmentSchema = new mongoose.Schema({
  barcode: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (date) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        // from 8am To 4pm every 30min
        return hours >= 8 && hours < 16 && (minutes === 0 || minutes === 30);
      },
      message: "Appointment are Only avaliable every half hours from 8am",
    },
  },
  barcodeImage: {
    type: String,
  },
});

appointmentSchema.index(
  { doctor: 1, appointmentDate: 1 },
  { unique: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
