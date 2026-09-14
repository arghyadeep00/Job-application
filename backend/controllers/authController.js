import User from "../models/User.js";
import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import resumeUploadCloudinary from "../utils/resumeUploadCloudinary.js";

/* REGISTER */
export const register = async (req, res) => {
  try {
    const {
      firstname,
      middlename,
      lastname,
      email,
      countryCode,
      phoneNumber,
      domain,
      password,
      isEmailVerified,
      isPhoneVerified,
    } = req.body;

    // require all the fields
    if (
      !firstname ||
      !lastname ||
      !email ||
      !domain ||
      !password ||
      !countryCode ||
      !phoneNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "Require all the fields",
      });
    }

    // check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // check file present or not
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF required",
      });
    }
    // upload to cloudinary
    const result = await resumeUploadCloudinary(req.file.buffer);

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      firstname,
      middlename,
      lastname,
      email,
      phone: {
        countryCode,
        phoneNumber,
      },
      isEmailVerified,
      isPhoneVerified,
      domain,
      password: hashedPassword,
      resume: { url: result.secure_url, public_id: result.public_id },
    });

    res.status(201).json({ success: true, message: "Registration successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* LOGIN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "3d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    user.password = "";
    res.status(200).json({
      success: true,
      message: "User login success",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};
export const authMe = async (req, res) => {
  try {
    if (req.user.role === "user") {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      return res.status(200).json({
        success: true,
        user,
      });
    }
    if (req.user.role === "admin") {
      const user = await Admin.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      return res.status(200).json({
        success: true,
        user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
