import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import companyData from "../static/emailData.js";
import sendMail from "../utils/mailer.js";
/* SUBMIT APPLICATION */
export const submitApplication = async (req, res) => {
  try {
    const application = await Application.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all applicants
export const allApplicants = async (req, res) => {
  try {
    const response = await User.find({}, "-password");
    return res.status(200).json({
      success: true,
      resultData: response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// all applications
export const applications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalApplications = await Application.countDocuments();

    const applications = await Application.find()
      .populate(
        "user",
        "firstname middlename lastname email phone domain skills resume experience",
      )
      .populate(
        "job",
        "title department jobType experience description skills closingDate createdAt",
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      totalApplications,
      currentPage: page,
      totalPages: Math.ceil(totalApplications / limit),
      applications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update status for shortlist and rejected
export const updateStatus = async (req, res) => {
  try {

    const { status, applicationId, email, firstname, jobId } = req.body;

    //update status application collection
    await Application.findByIdAndUpdate(applicationId, { status });
    // find job
    const job = await Job.findById(jobId)
    //send email to user

    if (status === "Shortlisted") {
      await sendMail(
        email,
        `Congratulations! You’ve Been Selected at ${companyData.companyName}`,
        "selected", {
        name: firstname,
        company: companyData.companyName,
        date: companyData.date,
        companyEmail: companyData.companyEmail,
        role: job.title
      })
    }

    if (status === "Rejected") {
      await sendMail(
        email,
        "Update on Your Application",
        'rejected',
        {
          name: firstname,
          company: companyData.companyName,
          date: companyData.date,
          companyEmail: companyData.companyEmail,
          role: job.title
        })
    }

    return res.status(200).json({
      success: true,
      message: "status update success",
    });
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const searchApplication = async (req, res) => {
  try {
    const { search, status, domain } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    let userMatch = {};

    if (search) {
      userMatch.$or = [
        { firstname: { $regex: search, $options: "i" } },
        { lastname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (domain) {
      userMatch.domain = domain;
    }
    let applications = await Application.find(query)
      .populate({
        path: "user",
        match: userMatch,
        select:
          "firstname middlename lastname email phone domain skills experience resume",
      })
      .populate(
        "job",
        "title department jobType experience description skills closingDate createdAt",
      )
      .sort({ createdAt: -1 });
    applications = applications.filter((app) => app.user !== null);

    res.status(200).json({
      success: true,
      total: applications.length,
      resultData: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
};

export const recentApplications = async (req, res) => {
  try {
    // Get date of 5 days ago
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const applications = await Application.find({
      createdAt: { $gte: fiveDaysAgo },
    })
      .populate(
        "user",
        "firstname middlename lastname email phone domain skills experience resume",
      )
      .populate(
        "job",
        "title department jobType experience description skills closingDate createdAt",
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: applications.length,
      resultData: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch last 5 days applications",
      error: error.message,
    });
  }
};

export const totalApplications = async (req, res) => {
  try {
    const response = await Application.countDocuments({});
    return res.status(200).json({
      success: true,
      resultData: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

export const pending = async (req, res) => {
  try {
    const response = await Application.countDocuments({ status: "Pending" });
    return res.status(200).json({
      success: true,
      resultData: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};
export const shortListed = async (req, res) => {
  try {
    const response = await Application.countDocuments({
      status: "Shortlisted",
    });
    return res.status(200).json({
      success: true,
      resultData: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};
export const rejected = async (req, res) => {
  try {
    const response = await Application.countDocuments({ status: "Rejected" });
    return res.status(200).json({
      success: true,
      resultData: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

export const shortlistedApplicants = async (req, res) => {
  try {
    const response = await Application.find({ status: { $in: ["Shortlisted", "Scheduled"] } })
      .populate(
        "user",
        "firstname middlename lastname email phone domain skills experience resume",
      )
      .populate(
        "job",
        "title department jobType experience description skills closingDate createdAt",
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      resultData: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
