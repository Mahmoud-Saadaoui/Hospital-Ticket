const User = require("../models/User");
const Doctor = require("../models/Doctor");
const path = require("path");
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");
const fs = require("fs");
const httpStatusText = require("../utils/httpStatusText");
const AllowedSpecialties = require("../utils/specialties");

const getPagination = (req) => {
  const requestedPage = Number.parseInt(req.query.page, 10);
  const requestedLimit = Number.parseInt(req.query.limit, 10);
  const page = Number.isInteger(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1;
  const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
    ? Math.min(requestedLimit, 50)
    : 10;

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

const buildPagination = (page, limit, total) => ({
  page,
  limit,
  total,
  pages: Math.ceil(total / limit),
  hasNextPage: page * limit < total,
  hasPreviousPage: page > 1,
});

/**
 *
 * @desc Create New Doctor
 * @rout /doctor/new
 * @method POST
 * @access private (only admin)
 */
const createDoctor = async (req, res) => {
  const { fullName, specialty, email, phone, bio } = req.body;
  if (!fullName || !email || !phone || !specialty) {
    return res.status(400).json({
      status: httpStatusText.FAIL,
      data: {
        title: "All fields are required",
      },
    });
  }
  if (!AllowedSpecialties.includes(specialty)) {
    return res.status(400).json({
      status: httpStatusText.FAIL,
      data: {
        title: "Specialization is not allowed",
      },
    });
  }
  //Only admin
  const creator = await User.findById(req.userId);
  if (!creator || creator.isAdmin !== true) {
    return res.status(400).json({
      status: httpStatusText.FAIL,
      data: {
        title: "Only admin can create Doctor",
      },
    });
  }
  const doctor = await Doctor.create({
    fullName,
    email,
    phone,
    bio,
    specialty,
  });
  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: {
      doctor,
    },
  });
};

/**
 *
 * @desc Get All Doctor
 * @rout /doctor/doctors
 * @method GET
 * @access private (Only admin)
 */

const getAllDoctor = async (req, res) => {
  const { page, limit, skip } = getPagination(req);
  const [doctors, total] = await Promise.all([
    Doctor.find().sort({ fullName: 1 }).skip(skip).limit(limit),
    Doctor.countDocuments(),
  ]);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      doctors,
      pagination: buildPagination(page, limit, total),
    },
  });
};

/**
 *
 * @desc Get Doctor By Id
 * @rout /doctor/doctors/:id
 * @method Get
 * @access private (only admin)
 */

const getDoctorById = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    return res.status(404).json({
      status: httpStatusText.FAIL,
      data: {
        title: "doctor not found",
      },
    });
  }
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      doctor,
    },
  });
};

/**
 *
 * @desc Get Doctor patients
 * @rout /doctor/doctors/:id/patients
 * @method Get
 * @access private (only admin)
 */

const getDoctorPatients = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate({
    path: "patients",
    select: "fullName email phone",
  });
  if (!doctor) {
    return res.status(404).json({
      status: httpStatusText.FAIL,
      data: {
        title: "doctor not found",
      },
    });
  }
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      doctorPatients: doctor.patients,
    },
  });
};

/**
 *
 * @desc Get Doctors specialties
 * @rout /doctor/doctors/specialty/:specialty
 * @method Get
 * @access public
 */

const getDoctorsBySpecialty = async (req, res) => {
  try {
    const { specialty } = req.params;
    const { page, limit, skip } = getPagination(req);
    const [doctors, total] = await Promise.all([
      Doctor.find({ specialty })
        .sort({ fullName: 1 })
        .skip(skip)
        .limit(limit),
      Doctor.countDocuments({ specialty }),
    ]);

    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        doctors,
        pagination: buildPagination(page, limit, total),
      },
    });
  } catch (err) {
    res.status(500).json({
      status: httpStatusText.ERROR,
      data: {
        message: "Unable to fetch doctors",
      },
    });
  }
};
/**
 *
 * @desc Get Doctors By Specialty
 * @rout /doctor/doctors?specialty="specialty-Name"
 * @method Get
 * @access public
 */

const getSpecialties = async (req, res) => {
  const specialties = await Doctor.distinct("specialty");
  if (!specialties.length) {
    return res.status(404).json({
      status: httpStatusText.FAIL,
      data: {
        doctor: "Add specialty first",
      },
    });
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      specialties,
    },
  });
};

/**
 *
 * @desc Update Doctor
 * @rout /doctor/doctors/:id
 * @method PUT
 * @access private (only Admin)
 */

const updateDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        status: httpStatusText.FAIL,
        data: {
          doctor: "doctor not found",
        },
      });
    }
    if (req.isAdmin !== true) {
      return res.status(404).json({
        status: httpStatusText.FAIL,
        data: {
          title: "you are not authorized",
        },
      });
    }
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      {
        $set: {
          fullName: req.body.fullName,
          specialty: req.body.specialty,
          email: req.body.email,
          phone: req.body.phone,
          bio: req.body.bio,
        },
      },
      { new: true, runValidators: true, context: "query" }
    );

    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        doctor: updatedDoctor,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: error.message,
    });
  }
};

/**
 *
 * @desc Delete Doctor
 * @rout /doctor/doctors/:id
 * @method DELETE
 * @access private (only Admin)
 */
const deleteDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        status: httpStatusText.FAIL,
        data: {
          doctor: "doctor not found",
        },
      });
    }
    if (req.isAdmin !== true) {
      return res.status(404).json({
        status: httpStatusText.FAIL,
        data: {
          title: "you are not authorized",
        },
      });
    }
    await Doctor.findByIdAndDelete(doctorId);

    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        doctor: null,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: error.message,
    });
  }
};

/**
 *
 * @desc Upload Doctor image
 * @rout /doctor//upload-doctor-image
 * @method POST
 * @access private (only admin)
 */

const profilePhotoUpload = async (req, res) => {
  //GET doctor from db
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    return res.status(404).json({
      status: httpStatusText.FAIL,
      data: {
        title: "doctor not found",
      },
    });
  }
  if (!req.file) {
    return res.status(400).json({
      status: httpStatusText.FAIL,
      data: {
        title: "Send a photo",
      },
    });
  }
  //GET img path
  const imagepath = path.join(__dirname, `../images/${req.file.filename}`);

  try {
    const uploadToCloudinary = await cloudinaryUploadImg(imagepath);

    if (doctor.profilePhoto.publicId !== null) {
      await cloudinaryDeleteImg(doctor.profilePhoto.publicId);
    }

    doctor.profilePhoto = {
      url: uploadToCloudinary.secure_url,
      publicId: uploadToCloudinary.public_id,
    };
    await doctor.save();

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        profilePhoto: {
          url: uploadToCloudinary.secure_url,
          publicId: uploadToCloudinary.public_id,
        },
      },
    });
  } finally {
    if (fs.existsSync(imagepath)) {
      try {
        fs.unlinkSync(imagepath);
      } catch (cleanupError) {
        console.error("Temporary doctor image cleanup failed:", cleanupError);
      }
    }
  }
};

module.exports = {
  createDoctor,
  getAllDoctor,
  getDoctorById,
  getDoctorPatients,
  getDoctorsBySpecialty,
  getSpecialties,
  updateDoctor,
  deleteDoctor,
  profilePhotoUpload,
};
