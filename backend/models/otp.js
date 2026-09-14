import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    value: String,
    otp: String,
    expiresAt: Date,
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Otp", otpSchema);
