import mongoose from "mongoose";

const emailLogSchema = new mongoose.Schema(
  {
    to: String,
    subject: String,
    status: {
      type: String,
      enum: ["sent", "failed"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("EmailLog", emailLogSchema);
