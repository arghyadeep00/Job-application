import Otp from "../models/otp.js";
import transporter from "../services/nodemailer.js";
import twilioClient from "../services/twilio.js";

export const sendOtp = async (req, res) => {
  try {
    const { value, type, countryCode } = req.body;

    if (!value) {
      return res.status(400).json({ success: false, message: "Missing value" });
    }

    // generate otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    await Otp.deleteMany({ value });
    await Otp.create({ value, otp, expiresAt });

    //  SEND EMAIL OTP
    if (type === "email") {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: value,
        subject: "Your OTP Code",
        html: `<h2>Your OTP is <b>${otp}</b></h2><p>Valid for 2 minutes</p>`,
      });
    }

    // SEND EMAIL OTP
    if (type === "phoneNumber") {
      if (!/^[0-9]{6,14}$/.test(value)) {
        return res.status(400).json({
          success: false,
          message: "Invalid phone number",
        });
      }

  
      await twilioClient.messages.create({
        body: `Your OTP is ${otp}. It expires in 2 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: countryCode + value,
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: "OTP send failed" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { value, otp } = req.body;

    const record = await Otp.findOne({ value });

    if (!record) {
      return res.json({ success: false, message: "OTP not found" });
    }
    // check expire time
    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: record._id });
      return res.json({ success: false, message: "OTP expired" });
    }

    // match otp
    if (record.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    // otp match and save record
    record.verified = true;
    await record.save();

    res.json({ success: true, message: "OTP verified" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};
