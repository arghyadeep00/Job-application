import Job from "../models/Job.js";
import Application from "../models/Application.js";
import sendMail from "../utils/mailer.js";
import User from "../models/User.js";
import companyData from "../static/emailData.js";
// function for new job post
export const postJob = async (req, res) => {
  const {
    jobtitle,
    department,
    jobtype,
    experience,
    location,
    openingjobs,
    closingdate,
    jobdescription,
    skills,
  } = req.body;
  try {
    // check require fields
    if (
      !jobtitle ||
      !jobtype ||
      !experience ||
      !location ||
      !jobdescription ||
      !skills
    ) {
      return res.status(400).json({
        success: false,
        message: "Requre this fileds",
      });
    }
    // store data in db
    await Job.create({
      title: jobtitle,
      department: department,
      jobType: jobtype,
      experience: experience,
      location: location,
      numberOfOpening: openingjobs,
      description: jobdescription,
      skills: skills,
      closingDate: closingdate,
      postedBy: req.user.id,
    });

    // final and send response to user
    return res.status(201).json({
      success: true,
      message: "Job post successfylly",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// fetch all posted jobs

export const allJobs = async (req, res) => {
  try {
    const resultData = await Job.find({});
    return res.status(200).json({
      success: true,
      resultData,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// apply new job

export const applyJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.body.id;

    const checkUser = await Application.findOne({ user: userId, job: jobId });

    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: "Alrady applied",
      });
    }
    const job = await Job.findById(jobId);

    const closingDate = new Date(job.closingDate);
    const currentDate = new Date();

    if (closingDate < currentDate) {
      return res.status(400).json({
        success: false,
        message: "Job is expired",
      });
    }
    const application = await Application.create({
      user: userId,
      job: jobId,
    });

    const user = await User.findById(userId).select("email firstname");

    await sendMail(user.email, `We’ve Received Your Application for ${job.title} at ${companyData.companyName}`, "applicationSubmitted", {
      name: user.firstname, date: companyData.date, company: companyData.companyName, applicationId: application._id, role: job.title,
      companyEmail: companyData.companyEmail
    })

    return res.status(201).json({
      success: true,
      message: "application successfully",
    });
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// applied jobs
export const fetchAppliedJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const response = await Application.find({ user: userId }).populate(
      "job",
      "title department jobType experience description location numberOfOpening closingDate createdAt",
    );
    return res.status(200).json({
      success: true,
      resultData: response,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateJobDetails = async (req, res) => {
  const {
    id,
    title,
    department,
    jobType,
    location,
    numberOfOpening,
    description,
    hiringWorkflow,
    eligibilityCriteria,
    experience,
    skills,
    responsibilities,
    closingDate,
  } = req.body;
  try {
    const updates = {
      title,
      department,
      jobType,
      location,
      numberOfOpening,
      hiringWorkflow,
      eligibilityCriteria,
      skills,
      description,
      experience,
      responsibilities,
      closingDate,
    };
    Object.keys(updates).forEach(
      (key) => updates[key] === undefined && delete updates[key],
    );
    await Job.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      message: "Update success",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    await Job.findByIdAndDelete(id);
    await Application.deleteMany({ job: id });
    return res.status(200).json({
      success: true,
      message: "delete successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error can't delete" });
  }
};
