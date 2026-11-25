const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const mongoose = require("mongoose");
const sendEmail = require("../utils/sendEmail");
const httpStatusText = require("../utils/httpStatusText");

/**
 *
 * @desc Create New appointment
 * @rout /appointment/new
 * @method POST
 * @access private (only loggin user)
 */

const createAppointment = async (req, res) => {
  const { doctorId, appointmentDate } = req.body;
  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(400).json({
      status: httpStatusText.FAIL,
      data: {
        title: "Invalid doctor id",
      },
    });
  }

  const appointmentTime = new Date(appointmentDate);
  if (Number.isNaN(appointmentTime.getTime())) {
    return res.status(400).json({
      status: httpStatusText.FAIL,
      data: {
        title: "Invalid appointment date",
      },
    });
  }

  if (appointmentTime.getTime() <= Date.now()) {
    return res.status(400).json({
      status: httpStatusText.FAIL,
      data: {
        title: "Invalid time ",
      },
    });
  }

  const hours = appointmentTime.getHours();
  const minutes = appointmentTime.getMinutes();
  if (!(hours >= 8 && hours < 16 && (minutes === 0 || minutes === 30))) {
    return res.status(400).json({
      status: httpStatusText.FAIL,
      data: {
        title:
          "Appointment are Only avaliable every half hours from 8am to 4pm ",
      },
    });
  }

  const session = await mongoose.startSession();
  let newAppointment;

  try {
    session.startTransaction();

    const doctor = await Doctor.findById(doctorId).session(session);
    const patient = await User.findById(req.userId).session(session);

    if (!doctor) {
      await session.abortTransaction();
      return res.status(404).json({
        status: httpStatusText.FAIL,
        data: {
          title: "doctor not found ",
        },
      });
    }

    if (!patient) {
      await session.abortTransaction();
      return res.status(401).json({
        status: httpStatusText.FAIL,
        data: {
          title: "Unauthorized",
        },
      });
    }

    const startOfDay = new Date(appointmentTime);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const existingPatientAppointment = await Appointment.findOne({
      doctor: doctorId,
      patient: req.userId,
      appointmentDate: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    }).session(session);

    if (existingPatientAppointment) {
      await session.abortTransaction();
      return res.status(400).json({
        status: httpStatusText.FAIL,
        data: {
          title: "Patient already have ticket",
        },
      });
    }

    const dailyAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      appointmentDate: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    }).session(session);

    const availableSlotsPerDay = 16;
    if (dailyAppointments >= availableSlotsPerDay) {
      await session.abortTransaction();
      return res.status(400).json({
        status: httpStatusText.FAIL,
        data: {
          title: "All tickets for today are booked",
        },
      });
    }

    newAppointment = await Appointment.create(
      [
        {
          barcode: req.barcodeData.barcodeText,
          barcodeImage: req.barcodeData.barecodeImage,
          doctor: doctorId,
          patient: req.userId,
          appointmentDate: appointmentTime,
        },
      ],
      { session }
    ).then(([appointment]) => appointment);

    const hasPatient = doctor.patients.some(
      (patientId) => patientId.toString() === req.userId.toString()
    );
    if (!hasPatient) {
      doctor.patients.push(req.userId);
      await doctor.save({ session });
    }

    await session.commitTransaction();

    try {
      await sendEmail({
        to: patient.email,
        barcodeText: newAppointment.barcode,
        barcodeImage: newAppointment.barcodeImage,
        appointmentDate: newAppointment.appointmentDate,
      });
    } catch (emailError) {
      console.error("Appointment email failed:", emailError);
    }

    return res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: {
        appointment: newAppointment,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    if (error?.code === 11000) {
      return res.status(409).json({
        status: httpStatusText.FAIL,
        data: {
          title: "Appointment is booked",
        },
      });
    }
    console.error("Appointment creation failed:", error);
    return res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Unable to create appointment",
    });
  } finally {
    await session.endSession();
  }

};

/**
 *
 * @desc Get All appointment
 * @rout /appointment/
 * @method GET
 * @access private (Only admin)
 */

const getAllAppointment = async (req, res) => {
  const appointments = await Appointment.find()
    .populate("doctor", "fullName specialty")
    .select("appointmentDate barcode doctor");
  if (!appointments.length) {
    return res.status(404).json({
      status: httpStatusText.FAIL,
      data: {
        title: "doctor not found ther are no appointment ",
      },
    });
  }
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      appointments,
    },
  });
};

/**
 *
 * @desc Get Patient appointment
 * @rout /appointment/:id
 * @method GET
 * @access private (Only admin)
 */

const getPatientAppointments = async (req, res) => {
  const { id } = req.params;
  if (!req.isAdmin && req.userId.toString() !== id.toString()) {
    return res.status(403).json({
      status: httpStatusText.FAIL,
      data: {
        title: "Forbidden",
      },
    });
  }
  const appointmens = await Appointment.find({ patient: id })
    .populate("doctor", "fullName specialty")
    .select("appointmentDate barcode doctor");

  if (!appointmens.length) {
    return res.status(404).json({
      status: httpStatusText.FAIL,
      data: {
        title: "There are no appointment for this patien",
      },
    });
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      appointments: appointmens,
    },
  });
};

/**
 *
 * @desc Cancel appointment
 * @rout /appointment/:id
 * @method DELETE
 * @access private (Only admin)
 */

const cancelAppointments = async (req, res) => {
  const appointmenId = req.params.id;
  const patientid = req.userId;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const appointment = await Appointment.findById(appointmenId).session(
      session
    );
    if (!appointment) {
      await session.abortTransaction();
      return res.status(404).json({
        status: httpStatusText.FAIL,
        data: {
          title: "there are no appointment",
        },
      });
    }

    const isOwner =
      appointment.patient &&
      appointment.patient.toString() === patientid.toString();

    if (!req.isAdmin && !isOwner) {
      await session.abortTransaction();
      return res.status(403).json({
        status: httpStatusText.FAIL,
        data: {
          title: "you cant cancel this appointment",
        },
      });
    }

    await Appointment.deleteOne({ _id: appointmenId }).session(session);

    const remainingAppointment = await Appointment.exists({
      doctor: appointment.doctor,
      patient: appointment.patient,
      appointmentDate: { $gt: new Date() },
    }).session(session);

    if (!remainingAppointment) {
      await Doctor.updateOne(
        { _id: appointment.doctor },
        { $pull: { patients: appointment.patient } },
        { session }
      );
    }

    await session.commitTransaction();

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        appointment: null,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Appointment cancellation failed:", error);
    return res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Unable to cancel appointment",
    });
  } finally {
    await session.endSession();
  }
};

module.exports = {
  createAppointment,
  getPatientAppointments,
  getAllAppointment,
  cancelAppointments,
};
