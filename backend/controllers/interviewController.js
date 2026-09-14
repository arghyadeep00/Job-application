import Interview from "../models/Interview.js";
import Application from "../models/Application.js"
import sendMail from "../utils/mailer.js";
import companyData from "../static/emailData.js";
import User from "../models/User.js";
import Job from "../models/Job.js";

export const interviewSchedule = async (req, res) => {
    try {
        const { applicantId, jobId, interviewDate, interviewData, applicationId } = req.body;

        // schedule save 
        await Interview.create({ applicant: applicantId, job: jobId, scheduledBy: req.user.id, interviewDate: interviewDate, mode: interviewData.mode, meetingLink: interviewData.meetLink, location: interviewData.location })

        // status change application collection
        await Application.findByIdAndUpdate(applicationId, { status: "Scheduled" })

        // email send confirmation
        const user = await User.findById(applicantId).select("firstname email")
        const job = await Job.findById(jobId).select("title");

        const d = new Date(interviewDate);
        const dateInterview = d.toLocaleDateString("en-In");
        const timeInterview = d.toLocaleTimeString();

        await sendMail(user.email, "Interview Scheduled timing", "interview", {
            name: user.firstname, role: job.title, company: companyData.companyName, date: dateInterview, time: timeInterview, companyEmail: companyData.companyEmail, mode: interviewData.mode, meetingLink: interviewData.meetLink || interviewData.location,
        })

        return res.status(200).json({
            success: true,
            message: "Schedule confirmed"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            messagel: "internal server error"
        })
    }
}

export const interviewDetails = async (req, res) => {
    try {
        const id = req.user.id;
        const response = await Interview.find({ applicant: id }).populate("job", "title department jobType location").populate("applicant", "resume.url")
        return res.status(200).json({
            success: true,
            resultData: response
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: true,
            message: "internal server error"
        })
    }
}