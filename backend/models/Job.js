import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    department: {
      type: String,
    },
    jobType: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
    },
    numberOfOpening: {
      type: Number,
    },
    description: {
      type: String,
      required: true,
    },
    hiringWorkflow: {
      type: String,
    },
    eligibilityCriteria:
    {
      type: String,
      trim: true
    }
    ,
    skills: String,
    closingDate: {
      type: Date,
    },
    responsibilities:{
      type:String,
      trim:true
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Job", jobSchema);
