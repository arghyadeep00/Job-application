import Application from "../models/Application.js";
import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// REGISTER AMDIN ACCOUNT
export const adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: true,
        message: "Require all the fields",
      });
    }
    const checkUser = await Admin.findOne({ email });
    if (checkUser) {
      res.status(400).json({
        success: false,
        message: "User alrady exist",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.status(200).json({
      success: true,
      message: "Admin Created",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ADMIN LOGIN
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: true,
        message: "Require all the fileds",
      });
    }

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
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
    return res.status(200).json({
      success: true,
      message: "login success",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET ALL APPLICATIONS */
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate(
      "user",
      "name email",
    );
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE APPLICATION STATUS */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    res.status(200).json({
      message: "Application status updated",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FETCH USER ACCOUNT

export const fetchUser = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await User.findById(id);

    return res.status(200).json({
      success: true,
      resultData: response,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};
// ADMIN PROFILE
export const adminProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const resposne = await Admin.findById(id, "-password");

    return res.status(200).json({
      success: false,
      resultData: resposne,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.response.message || "Internal server Error",
    });
  }
};


// ADMIN PASSWORD CHANGE

export const changePassword = async (req, res) => {
  try {

    const { oldPassword, newPassword } = req.body.data;
    const id = req.user.id;

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      })
    }
    // check old password
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect"
      })
    }
    // hash new passwrod
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();


    return res.status(200).json({
      success: true,
      message: "Password Update Success"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}