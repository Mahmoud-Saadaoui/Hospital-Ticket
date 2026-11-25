const User = require("../models/User");
const bcrypt = require("bcrypt");
const path = require("path");
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");
const fs = require("fs");
const httpStatusText = require("../utils/httpStatusText");

/**
 *
 * @desc Get All User
 * @rout /users/
 * @method GET
 * @access private (only admin)
 */
const getAllUsers = async (req, res) => {
  const user = await User.find().select(
    "-password -passwordResetCode -passwordResetExpires -passwordResetVerified"
  );
  if (!user.length) {
    return res.status(400).json({
      status: httpStatusText.FAIL,
      data: {
        title: "Not user found",
      },
    });
  }
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      user,
    },
  });
};

/**
 *
 * @desc Get User By Id
 * @rout /users/:id
 * @method GET
 * @access private (only admin)
 */
const getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "-password -passwordResetCode -passwordResetExpires -passwordResetVerified"
  );
  if (!user) {
    return res.status(404).json({
      status: httpStatusText.FAIL,
      data: {
        title: "Not user found",
      },
    });
  }
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      user,
    },
  });
};

/**
 *
 * @desc Update User
 * @rout /users/:id
 * @method Put
 * @access private (only owner)
 */
const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  const userId = req.userId;
  const { email } = req.body;
  if (!user) {
    return res.status(404).json({
      status: httpStatusText.FAIL,
      data: {
        title: "The post not found",
      },
    });
  }
  if (user._id.toString() !== userId) {
    return res.status(404).json({
      status: httpStatusText.FAIL,
      data: {
        title: "Cant access this post",
      },
    });
  }
  const checkEmail = await User.findOne({
    email,
    _id: { $ne: req.params.id },
  }).exec();
  if (checkEmail) {
    return res.status(409).json({
      status: httpStatusText.FAIL,
      data: {
        title: "User already exists",
      },
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        phone: req.body.phone,
      },
    },
    { new: true, runValidators: true }
  )
    .select("-password")
    .lean();
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      updatedUser,
    },
  });
};

/**
 *
 * @desc Delete User
 * @rout /users/:id
 * @method Delete
 * @access private (only adsmin)
 */
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(400).json({
      status: httpStatusText.FAIL,
      data: {
        title: "Not user found",
      },
    });
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      user: null,
    },
  });
};

/**
 *
 * @desc Upload User image
 * @rout /users//upload-user-image
 * @method POST
 * @access private (owner of Acount)
 */

const profilePhotoUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: httpStatusText.FAIL,
      data: {
        title: "Send the Photo",
      },
    });
  }
  //GET img path
  const imagepath = path.join(__dirname, `../images/${req.file.filename}`);

  try {
    const uploadToCloudinary = await cloudinaryUploadImg(imagepath);
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({
        status: httpStatusText.FAIL,
        data: {
          title: "Unauthorized",
        },
      });
    }

    if (user.profilePhoto.publicId !== null) {
      await cloudinaryDeleteImg(user.profilePhoto.publicId);
    }

    user.profilePhoto = {
      url: uploadToCloudinary.secure_url,
      publicId: uploadToCloudinary.public_id,
    };
    await user.save();

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
        console.error("Temporary user image cleanup failed:", cleanupError);
      }
    }
  }
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  profilePhotoUpload,
};
