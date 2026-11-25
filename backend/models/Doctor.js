const mongoose = require("mongoose");
const User = require("./User");
const AllowedSpecialties = require("../utils/specialties");
const doctorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    specialty: {
      type: String,
      enum: AllowedSpecialties,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    bio: String,
    profilePhoto: {
      type: Object,
      default: {
        url: "",
        publicId: null,
      },
    },
    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);
