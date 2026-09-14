
import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",     
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    scheduledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",        
      required: true,
    },

    interviewDate: {
      type: Date,
      required: true,
    },

    mode: {
      type: String,
      enum: ["Online", "Offline"],
      required: true,
    },

    meetingLink: {
      type: String,       
    },

    location: {
      type: String,         
    },

    status: {
      type: String,
      enum: [
        "Scheduled",
        "Completed",
        "Cancelled",
        "No Show",
        "Selected",
        "Rejected"
      ],
      default: "Scheduled",
    },

    remarks: {
      type: String,       
    },
  },
  { timestamps: true }
);

export default mongoose.model("Interview", interviewSchema);
