const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const httpStatusText = require("../utils/httpStatusText");

const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

/**
 *
 * @desc register
 * @rout /auth/register
 * @method POST
 * @access public
 */
const register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({
      status: httpStatusText.FAIL,
      data: {
        title: "All fieldes are required",
      },
    });
  }
  const foundUser = await User.findOne({ email }).exec();
  if (foundUser) {
    return res.status(409).json({
      status: httpStatusText.FAIL,
      data: {
        title: "User already exists",
      },
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    isAdmin: false,
  });
  const accessToken = jwt.sign(
    {
      userInfo: {
        id: user._id,
        isAdmin: user.isAdmin,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    {
      userInfo: {
        id: user._id,
        isAdmin: user.isAdmin,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  res.cookie("jwt", refreshToken, cookieOptions);
  res.json({
    status: httpStatusText.SUCCESS,
    data: {
      accessToken,
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  });
};

/**
 *
 * @desc login
 * @rout /auth/login
 * @method POST
 * @access private (register users)
 */
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: httpStatusText.FAIL,
      data: {
        title: "All fieldes are required",
      },
    });
  }
  const foundUser = await User.findOne({ email }).select("+password").exec();
  if (!foundUser) {
    return res.status(401).json({
      status: httpStatusText.FAIL,
      data: {
        title: "Invalid credentials",
      },
    });
  }
  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) {
    return res.status(401).json({
      status: httpStatusText.FAIL,
      data: {
        title: "Invalid credentials",
      },
    });
  }

  const accessToken = jwt.sign(
    {
      userInfo: {
        id: foundUser._id,
        isAdmin: foundUser.isAdmin,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    {
      userInfo: {
        id: foundUser._id,
        isAdmin: foundUser.isAdmin,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  res.cookie("jwt", refreshToken, cookieOptions);
  res.json({
    status: httpStatusText.SUCCESS,
    data: {
      accessToken,
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      isAdmin: foundUser.isAdmin,
    },
  });
};

/**
 *
 * @desc refresh Token
 * @rout /auth/refresh
 * @method GET
 * @access private (register users)
 */

const refresh = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return res.status(401).json({
      status: httpStatusText.FAIL,
      data: {
        title: "Unauthorized",
      },
    });
  }
  const refreshToken = cookies.jwt;
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    return res.status(403).json({
      status: httpStatusText.FAIL,
      data: {
        title: "Forbidden",
      },
    });
  }

  if (!decoded?.userInfo?.id) {
    return res.status(403).json({
      status: httpStatusText.FAIL,
      data: {
        title: "Forbidden",
      },
    });
  }

  const foundUser = await User.findById(decoded.userInfo.id).exec();
  if (!foundUser) {
    return res.status(401).json({
      status: httpStatusText.FAIL,
      data: {
        title: "Unauthorized",
      },
    });
  }

  const accessToken = jwt.sign(
    {
      userInfo: {
        id: foundUser._id,
        isAdmin: foundUser.isAdmin,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  return res.json({
    status: httpStatusText.SUCCESS,
    data: {
      accessToken,
    },
  });
};

/**
 *
 * @desc logout
 * @rout /auth/logout
 * @method POST
 * @access private (login users)
 */

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); //not content
  }
  res.clearCookie("jwt", cookieOptions);
  res.json({
    status: httpStatusText.FAIL,
    data: {
      title: "Logout success",
    },
  });
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};
