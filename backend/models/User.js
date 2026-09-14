import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ["Class X", "Class XII", "Graduation", "Post Graduation"],
      required: true,
    },
    institution: String,
    board: String,
    startDate: Date,
    endDate: Date,
    percentage: Number,
  },
  { _id: false },
);

const appliedJobSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  status: {
    type: String,
    enum: ["Applied", "Under Review", "Shortlisted", "Rejected"],
    default: "Applied",
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, trim: true },
    middlename: { type: String, trim: true },
    lastname: { type: String, required: true, trim: true },

    avatar: {
      url: String,
      public_id: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      countryCode: String,
      phoneNumber: String,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    location: {
      type: String,
    },

    dob: Date,

    password: {
      type: String,
      required: true,
    },

    education: [educationSchema],

    domain: String,

    experience: {
      companyName: { type: String },
      year: { type: Number }
    },


    skills: String,

    resume: {
      url: String,
      public_id: String,
    },

    appliedJobs: [appliedJobSchema],

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
