import Otp from "../models/otp.js";
import transporter from "../services/nodemailer.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Requie email",
      });
    }
    // generate otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);
    await Otp.deleteMany({ value: email });
    await Otp.create({ value: email, otp, expiresAt });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Recover your password",
      html: `<h2>Your OTP is <b>${otp}</b></h2><p>Valid for 3 minutes</p>`,
    });

    return res.status(200).json({
      success: false,
      message: "OTP send",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "OTP send failed" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Require all the email and otp",
      });
    }

    const record = await Otp.findOne({ value: email, otp });
    if (!record) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    // check expiry
    // if (record.expiresAt < new Date()) {
    //   await Otp.deleteOne({ _id: record._id });
    //   return res.status(400).json({ success: false, message: "OTP expired" });
    // }

    // match otp
    if (record.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    return res.status(200).json({
      success: true,
      message: "OTP verified",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password, otp } = req.body;
    
    const response = await Otp.findOne({ value: email });
  
    if (!response) {
      return res.status(400).json({
        success: false,
        message: "Please verify OTP",
      });
    }
    const chekUser = await User.findOne({ email });
    if (!chekUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate({ email }, { password: hashPassword });
    await Otp.deleteMany({ value: email });
    
    return res.status(200).json({
      success:true,
      message:"Password reset successfylly"
    })
  } catch (error) {
    console.log(error);
  }
};
