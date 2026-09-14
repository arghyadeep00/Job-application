import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import bcrypt from "bcrypt";

import Admin from "./models/Admin.js";
import User from "./models/User.js";
import Job from "./models/Job.js";
import Application from "./models/Application.js";
import Interview from "./models/Interview.js";
import EmailLog from "./models/EmailLog.js";
import Otp from "./models/otp.js";

dotenv.config();

// Fix DNS resolution for MongoDB Atlas SRV connection on Windows/custom DNS
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore if already set or not supported
}

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ Error: MONGO_URI environment variable is missing in .env");
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    console.log("\n🌱 =============================================");
    console.log("   JOB-APP RECRUITMENT DATABASE SEEDER");
    console.log("=============================================\n");

    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully!\n");

    // Check if --keep flag is provided
    const shouldKeep = process.argv.includes("--keep");

    if (!shouldKeep) {
      console.log("🧹 Clearing existing data from collections...");
      await Promise.all([
        Admin.deleteMany({}),
        User.deleteMany({}),
        Job.deleteMany({}),
        Application.deleteMany({}),
        Interview.deleteMany({}),
        EmailLog.deleteMany({}),
        Otp.deleteMany({}),
      ]);
      console.log("✅ Collections cleared successfully!\n");
    } else {
      console.log("ℹ️  '--keep' flag detected: skipping collection purge.\n");
    }

    // Pre-hash default passwords
    console.log("🔐 Hashing seed passwords...");
    const adminPasswordHash = await bcrypt.hash("AdminPassword123!", 10);
    const userPasswordHash = await bcrypt.hash("UserPassword123!", 10);
    console.log("✅ Passwords hashed successfully!\n");

    // 1. Seed Admins
    console.log("👤 Seeding Admins...");
    const admins = await Admin.insertMany([
      {
        name: "Arghya Admin",
        email: "admin@jobapp.com",
        password: adminPasswordHash,
        role: "admin",
      },
      {
        name: "Sarah Talent",
        email: "hr@jobapp.com",
        password: adminPasswordHash,
        role: "admin",
      },
    ]);
    console.log(`✅ Seeded ${admins.length} Admins`);

    const primaryAdmin = admins[0];
    const hrAdmin = admins[1];

    // 2. Seed Jobs
    console.log("\n💼 Seeding Jobs...");
    const futureDate = (daysAhead) => {
      const d = new Date();
      d.setDate(d.getDate() + daysAhead);
      return d;
    };

    const jobsData = [
      {
        title: "Senior Full Stack Engineer",
        department: "Engineering",
        jobType: "Full-time",
        experience: 3,
        location: "Bengaluru, India (Hybrid)",
        numberOfOpening: 3,
        description:
          "We are seeking an experienced Full Stack Engineer to lead web application development across our modern React and Node.js microservices ecosystem.",
        hiringWorkflow: "Resume Screening -> Technical Assessment -> System Design Interview -> Culture Fit -> Offer",
        eligibilityCriteria:
          "Bachelor's degree in Computer Science or related field with 3+ years in MERN stack development.",
        skills: "React, Node.js, Express, MongoDB, TypeScript, REST APIs, Redis",
        responsibilities:
          "Design and build scalable RESTful APIs, optimize React frontends for performance, and mentor junior engineers.",
        closingDate: futureDate(45),
        postedBy: primaryAdmin._id,
      },
      {
        title: "Frontend Developer",
        department: "Frontend",
        jobType: "Full-time",
        experience: 1,
        location: "Remote",
        numberOfOpening: 2,
        description:
          "Join our frontend craft team to build interactive, accessible, and high-performance user interfaces using React, Tailwind CSS, and Next.js.",
        hiringWorkflow: "Screening -> UI/UX Challenge -> Technical Round -> HR Discussion",
        eligibilityCriteria: "Proficiency in JavaScript (ES6+), React.js, HTML5, CSS3, and modern frontend tooling.",
        skills: "React, Tailwind CSS, JavaScript, Redux Toolkit, Next.js, Git",
        responsibilities:
          "Translate Figma wireframes into pixel-perfect web components, maintain component libraries, and optimize client-side bundle size.",
        closingDate: futureDate(30),
        postedBy: primaryAdmin._id,
      },
      {
        title: "AI / ML Research Engineer",
        department: "AI/ML",
        jobType: "Full-time",
        experience: 2,
        location: "Bengaluru, India",
        numberOfOpening: 2,
        description:
          "Innovate with cutting-edge Large Language Models, agentic frameworks, and predictive machine learning models to revolutionize recruitment workflows.",
        hiringWorkflow: "Resume Screening -> ML Coding Round -> Paper/Research Discussion -> Final Round",
        eligibilityCriteria: "M.Tech / B.Tech in CS/AI with hands-on experience in PyTorch, NLP, and model fine-tuning.",
        skills: "Python, PyTorch, HuggingFace, LLMs, LangChain, FastAPI, Docker",
        responsibilities:
          "Fine-tune generative models, design retrieval-augmented generation (RAG) pipelines, and deploy inference microservices.",
        closingDate: futureDate(60),
        postedBy: hrAdmin._id,
      },
      {
        title: "UI / UX Designer",
        department: "UI/UX",
        jobType: "Full-time",
        experience: 2,
        location: "Remote",
        numberOfOpening: 1,
        description:
          "Craft intuitive, human-centered digital experiences for candidate portals, dashboards, and enterprise hiring suites.",
        hiringWorkflow: "Portfolio Review -> Design Challenge -> Presentation -> Final Round",
        eligibilityCriteria: "Proven design portfolio showcasing web and mobile UX projects, wireframes, and design systems.",
        skills: "Figma, Adobe XD, Wireframing, Prototyping, Design Systems, User Research",
        responsibilities:
          "Conduct user interviews, design user journey maps, build high-fidelity interactive prototypes, and collaborate closely with engineers.",
        closingDate: futureDate(35),
        postedBy: hrAdmin._id,
      },
      {
        title: "Data Analyst Intern",
        department: "Data Science",
        jobType: "Internship",
        experience: 0,
        location: "Pune, India",
        numberOfOpening: 4,
        description:
          "Great opportunity for fresh graduates or final-year students looking to gain practical experience in data analytics, SQL queries, and BI visualization.",
        hiringWorkflow: "Aptitude Test -> SQL & Python Challenge -> HR Discussion",
        eligibilityCriteria: "Graduation in Statistics, Mathematics, Economics, or Computer Science. Strong SQL fundamentals.",
        skills: "SQL, Python, Pandas, PowerBI, Tableau, Excel",
        responsibilities:
          "Write analytical SQL queries, build executive dashboards, and prepare monthly metrics reports on platform KPIs.",
        closingDate: futureDate(20),
        postedBy: primaryAdmin._id,
      },
      {
        title: "Mobile App Developer (Flutter/React Native)",
        department: "App",
        jobType: "Full-time",
        experience: 2,
        location: "Hyderabad, India (Hybrid)",
        numberOfOpening: 2,
        description:
          "Build and maintain responsive cross-platform mobile apps for Android and iOS using Flutter and React Native.",
        hiringWorkflow: "Coding Round -> Architecture Review -> HR Discussion",
        eligibilityCriteria: "At least 1.5+ years building and deploying production apps to Google Play Store / Apple App Store.",
        skills: "Flutter, React Native, Dart, TypeScript, REST APIs, Firebase",
        responsibilities:
          "Develop mobile user interfaces, integrate backend APIs, and handle mobile performance monitoring and release management.",
        closingDate: futureDate(40),
        postedBy: hrAdmin._id,
      },
    ];

    const jobs = await Job.insertMany(jobsData);
    console.log(`✅ Seeded ${jobs.length} Jobs`);

    // 3. Seed Candidate Users
    console.log("\n👥 Seeding Candidate Users...");
    const usersData = [
      {
        firstname: "John",
        middlename: "Robert",
        lastname: "Doe",
        email: "john.doe@example.com",
        password: userPasswordHash,
        domain: "Full Stack",
        gender: "male",
        dob: new Date("1998-05-15"),
        location: "Bengaluru, Karnataka",
        phone: { countryCode: "+91", phoneNumber: "9876543210" },
        skills: "React, Node.js, Express, MongoDB, TypeScript, Docker",
        experience: { companyName: "InnovateTech Labs", year: 3 },
        avatar: {
          url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          public_id: "seed_avatar_john",
        },
        resume: {
          url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          public_id: "seed_resume_john",
        },
        education: [
          {
            level: "Class X",
            institution: "St. Xavier's High School",
            board: "CBSE",
            startDate: new Date("2013-04-01"),
            endDate: new Date("2014-03-31"),
            percentage: 89.5,
          },
          {
            level: "Class XII",
            institution: "St. Xavier's Junior College",
            board: "CBSE",
            startDate: new Date("2014-04-01"),
            endDate: new Date("2016-03-31"),
            percentage: 86.0,
          },
          {
            level: "Graduation",
            institution: "National Institute of Technology",
            board: "Autonomous",
            startDate: new Date("2016-08-01"),
            endDate: new Date("2020-05-31"),
            percentage: 82.4,
          },
        ],
        isEmailVerified: true,
        isPhoneVerified: true,
        role: "user",
      },
      {
        firstname: "Jane",
        lastname: "Smith",
        email: "jane.smith@example.com",
        password: userPasswordHash,
        domain: "Frontend",
        gender: "female",
        dob: new Date("2000-09-22"),
        location: "Mumbai, Maharashtra",
        phone: { countryCode: "+91", phoneNumber: "9876543211" },
        skills: "React.js, Tailwind CSS, JavaScript, Redux, Next.js",
        experience: { companyName: "PixelWeb Studio", year: 1 },
        avatar: {
          url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          public_id: "seed_avatar_jane",
        },
        resume: {
          url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          public_id: "seed_resume_jane",
        },
        education: [
          {
            level: "Class XII",
            institution: "Delhi Public School",
            board: "CBSE",
            startDate: new Date("2016-04-01"),
            endDate: new Date("2018-03-31"),
            percentage: 91.0,
          },
          {
            level: "Graduation",
            institution: "Mumbai University",
            board: "MU",
            startDate: new Date("2018-07-01"),
            endDate: new Date("2022-06-30"),
            percentage: 84.0,
          },
        ],
        isEmailVerified: true,
        isPhoneVerified: true,
        role: "user",
      },
      {
        firstname: "Alex",
        lastname: "Chen",
        email: "alex.chen@example.com",
        password: userPasswordHash,
        domain: "AI/ML",
        gender: "male",
        dob: new Date("1996-11-04"),
        location: "Bengaluru, Karnataka",
        phone: { countryCode: "+91", phoneNumber: "9876543212" },
        skills: "Python, PyTorch, HuggingFace, NLP, LLMs, Docker, LangChain",
        experience: { companyName: "Cognitive Labs", year: 3 },
        avatar: {
          url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
          public_id: "seed_avatar_alex",
        },
        resume: {
          url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          public_id: "seed_resume_alex",
        },
        education: [
          {
            level: "Graduation",
            institution: "Indian Institute of Technology",
            board: "Autonomous",
            startDate: new Date("2014-08-01"),
            endDate: new Date("2018-05-31"),
            percentage: 88.0,
          },
          {
            level: "Post Graduation",
            institution: "Indian Institute of Science",
            board: "IISc",
            startDate: new Date("2018-08-01"),
            endDate: new Date("2020-05-31"),
            percentage: 92.5,
          },
        ],
        isEmailVerified: true,
        isPhoneVerified: true,
        role: "user",
      },
      {
        firstname: "Sarah",
        lastname: "Jenkins",
        email: "sarah.jenkins@example.com",
        password: userPasswordHash,
        domain: "UI/UX",
        gender: "female",
        dob: new Date("1999-03-18"),
        location: "Pune, Maharashtra",
        phone: { countryCode: "+91", phoneNumber: "9876543213" },
        skills: "Figma, Adobe XD, Wireframing, User Research, Prototyping",
        experience: { companyName: "Creative UX Co.", year: 2 },
        avatar: {
          url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
          public_id: "seed_avatar_sarah",
        },
        resume: {
          url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          public_id: "seed_resume_sarah",
        },
        education: [
          {
            level: "Graduation",
            institution: "National Institute of Design",
            board: "NID",
            startDate: new Date("2017-07-01"),
            endDate: new Date("2021-06-30"),
            percentage: 85.0,
          },
        ],
        isEmailVerified: true,
        isPhoneVerified: true,
        role: "user",
      },
      {
        firstname: "Rahul",
        lastname: "Sharma",
        email: "rahul.sharma@example.com",
        password: userPasswordHash,
        domain: "Data Science",
        gender: "male",
        dob: new Date("2001-08-10"),
        location: "New Delhi, Delhi",
        phone: { countryCode: "+91", phoneNumber: "9876543214" },
        skills: "Python, SQL, Pandas, PowerBI, Tableau, Statistics",
        experience: { companyName: "Insight Analytics", year: 0 },
        avatar: {
          url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          public_id: "seed_avatar_rahul",
        },
        resume: {
          url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          public_id: "seed_resume_rahul",
        },
        education: [
          {
            level: "Class XII",
            institution: "Modern School",
            board: "CBSE",
            startDate: new Date("2017-04-01"),
            endDate: new Date("2019-03-31"),
            percentage: 87.0,
          },
          {
            level: "Graduation",
            institution: "Delhi University",
            board: "DU",
            startDate: new Date("2019-08-01"),
            endDate: new Date("2023-05-31"),
            percentage: 79.5,
          },
        ],
        isEmailVerified: true,
        isPhoneVerified: true,
        role: "user",
      },
      {
        firstname: "Priya",
        lastname: "Patel",
        email: "priya.patel@example.com",
        password: userPasswordHash,
        domain: "App",
        gender: "female",
        dob: new Date("1997-12-05"),
        location: "Ahmedabad, Gujarat",
        phone: { countryCode: "+91", phoneNumber: "9876543215" },
        skills: "Flutter, React Native, Dart, Firebase, REST APIs, Git",
        experience: { companyName: "AppCrafters Inc.", year: 2 },
        avatar: {
          url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          public_id: "seed_avatar_priya",
        },
        resume: {
          url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          public_id: "seed_resume_priya",
        },
        education: [
          {
            level: "Graduation",
            institution: "Gujarat Technological University",
            board: "GTU",
            startDate: new Date("2015-08-01"),
            endDate: new Date("2019-05-31"),
            percentage: 81.2,
          },
        ],
        isEmailVerified: true,
        isPhoneVerified: true,
        role: "user",
      },
    ];

    const users = await User.insertMany(usersData);
    console.log(`✅ Seeded ${users.length} Candidate Users`);

    // Map helpers for easier relational reference
    const userMap = {};
    users.forEach((u) => (userMap[u.email] = u));

    const jobMap = {};
    jobs.forEach((j) => (jobMap[j.title] = j));

    // 4. Seed Applications
    console.log("\n📝 Seeding Job Applications...");
    const applicationsData = [
      {
        user: userMap["john.doe@example.com"]._id,
        job: jobMap["Senior Full Stack Engineer"]._id,
        status: "Scheduled",
      },
      {
        user: userMap["john.doe@example.com"]._id,
        job: jobMap["Frontend Developer"]._id,
        status: "Pending",
      },
      {
        user: userMap["jane.smith@example.com"]._id,
        job: jobMap["Frontend Developer"]._id,
        status: "Scheduled",
      },
      {
        user: userMap["jane.smith@example.com"]._id,
        job: jobMap["Senior Full Stack Engineer"]._id,
        status: "Rejected",
      },
      {
        user: userMap["alex.chen@example.com"]._id,
        job: jobMap["AI / ML Research Engineer"]._id,
        status: "Hired",
      },
      {
        user: userMap["sarah.jenkins@example.com"]._id,
        job: jobMap["UI / UX Designer"]._id,
        status: "Shortlisted",
      },
      {
        user: userMap["rahul.sharma@example.com"]._id,
        job: jobMap["Data Analyst Intern"]._id,
        status: "Pending",
      },
      {
        user: userMap["priya.patel@example.com"]._id,
        job: jobMap["Mobile App Developer (Flutter/React Native)"]._id,
        status: "Shortlisted",
      },
      {
        user: userMap["priya.patel@example.com"]._id,
        job: jobMap["Frontend Developer"]._id,
        status: "Rejected",
      },
    ];

    const applications = await Application.insertMany(applicationsData);
    console.log(`✅ Seeded ${applications.length} Applications`);

    // Synchronize User.appliedJobs subdocument array to keep both data views consistent
    console.log("🔄 Synchronizing candidate appliedJobs subdocument arrays...");
    for (const app of applications) {
      let mappedStatus = "Applied";
      if (app.status === "Pending") mappedStatus = "Applied";
      else if (app.status === "Shortlisted" || app.status === "Scheduled" || app.status === "Hired") mappedStatus = "Shortlisted";
      else if (app.status === "Rejected") mappedStatus = "Rejected";

      await User.findByIdAndUpdate(app.user, {
        $push: {
          appliedJobs: {
            jobId: app.job,
            status: mappedStatus,
            appliedAt: app.createdAt || new Date(),
          },
        },
      });
    }
    console.log("✅ Candidate appliedJobs synchronized!");

    // 5. Seed Interviews
    console.log("\n📅 Seeding Interviews...");
    const interviewsData = [
      {
        applicant: userMap["john.doe@example.com"]._id,
        job: jobMap["Senior Full Stack Engineer"]._id,
        scheduledBy: primaryAdmin._id,
        interviewDate: futureDate(2),
        mode: "Online",
        meetingLink: "https://meet.google.com/ver-idia-fst",
        status: "Scheduled",
        remarks: "Round 1: System architecture and full stack technical challenge.",
      },
      {
        applicant: userMap["jane.smith@example.com"]._id,
        job: jobMap["Frontend Developer"]._id,
        scheduledBy: hrAdmin._id,
        interviewDate: futureDate(4),
        mode: "Online",
        meetingLink: "https://meet.google.com/ver-idia-fed",
        status: "Scheduled",
        remarks: "Round 1: React component design & state management review.",
      },
      {
        applicant: userMap["alex.chen@example.com"]._id,
        job: jobMap["AI / ML Research Engineer"]._id,
        scheduledBy: primaryAdmin._id,
        interviewDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        mode: "Offline",
        location: "job-app AI Labs, Tower 3, Floor 5, Tech Park, Bengaluru",
        status: "Selected",
        remarks: "Candidate performed exceptionally well across ML system design and model quantization.",
      },
      {
        applicant: userMap["jane.smith@example.com"]._id,
        job: jobMap["Senior Full Stack Engineer"]._id,
        scheduledBy: hrAdmin._id,
        interviewDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        mode: "Online",
        meetingLink: "https://meet.google.com/job-app-rej",
        status: "Rejected",
        remarks: "Candidate required more backend experience for this senior level role.",
      },
    ];

    const interviews = await Interview.insertMany(interviewsData);
    console.log(`✅ Seeded ${interviews.length} Interviews`);

    // 6. Seed Sample EmailLogs & Otp
    console.log("\n📧 Seeding Audit Logs (EmailLog & Otp)...");
    await EmailLog.insertMany([
      {
        to: "john.doe@example.com",
        subject: "We’ve Received Your Application for Senior Full Stack Engineer at job-app",
        status: "sent",
      },
      {
        to: "john.doe@example.com",
        subject: "Interview Scheduled timing - Senior Full Stack Engineer",
        status: "sent",
      },
      {
        to: "jane.smith@example.com",
        subject: "Interview Scheduled timing - Frontend Developer",
        status: "sent",
      },
      {
        to: "jane.smith@example.com",
        subject: "Update on Your Application - Senior Full Stack Engineer",
        status: "sent",
      },
    ]);

    await Otp.insertMany([
      {
        value: "john.doe@example.com",
        otp: "654321",
        expiresAt: new Date(Date.now() + 2 * 60 * 1000),
        verified: true,
      },
      {
        value: "9876543210",
        otp: "123456",
        expiresAt: new Date(Date.now() + 2 * 60 * 1000),
        verified: true,
      },
    ]);
    console.log("✅ Seeded sample EmailLog & Otp records");

    // Print summary
    console.log("\n=============================================");
    console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=============================================");
    console.log("\n📊 Summary of Seeded Data:");
    console.log(`   - Admins:       ${admins.length}`);
    console.log(`   - Candidates:   ${users.length}`);
    console.log(`   - Jobs:         ${jobs.length}`);
    console.log(`   - Applications: ${applications.length}`);
    console.log(`   - Interviews:   ${interviews.length}`);
    console.log(`   - Email Logs:   4`);
    console.log(`   - Otps:         2`);

    console.log("\n🔑 Test Credentials:");
    console.log("   ------------------------------------------------------------");
    console.log("   ROLE       EMAIL                      PASSWORD");
    console.log("   ------------------------------------------------------------");
    console.log("   Admin      admin@jobapp.com           AdminPassword123!");
    console.log("   Admin(HR)  hr@jobapp.com              AdminPassword123!");
    console.log("   Candidate  john.doe@example.com       UserPassword123!");
    console.log("   Candidate  jane.smith@example.com     UserPassword123!");
    console.log("   Candidate  alex.chen@example.com      UserPassword123!");
    console.log("   Candidate  sarah.jenkins@example.com  UserPassword123!");
    console.log("   Candidate  rahul.sharma@example.com   UserPassword123!");
    console.log("   Candidate  priya.patel@example.com    UserPassword123!");
    console.log("   ------------------------------------------------------------\n");

    await mongoose.connection.close();
    console.log("🔌 Database connection closed. Done!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding failed with error:", error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedDatabase();
