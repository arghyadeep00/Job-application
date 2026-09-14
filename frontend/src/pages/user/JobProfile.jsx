import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import toast from "react-hot-toast";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Calendar, 
  Users, 
  Search, 
  CheckCircle2, 
  Send, 
  Loader2, 
  ChevronRight,
  GraduationCap,
  Sparkles,
  Layers
} from "lucide-react";

const JobProfile = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("Job Description");

  const fetchJobs = async () => {
    try {
      const response = await api.get("/job/all-jobs");
      const jobList = response.data.resultData || [];
      setJobs(jobList);
      if (jobList.length > 0 && !selectedJob) {
        setSelectedJob(jobList[0]);
      }
    } catch (error) {
      toast.error("Error loading job listings");
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const res = await api.get("/job/fetch-applied-jobs");
      setAppliedJobs(res.data.resultData || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching applications");
    }
  };

  const applyJob = async (id) => {
    try {
      setLoading(true);
      const response = await api.post("/job/apply-job", { id });
      toast.success(response.data.message || "Application submitted successfully!");
      fetchJobs();
      fetchAppliedJobs();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, []);

  const isSelectedJobApplied = appliedJobs.some(
    (applied) => applied.job?._id === selectedJob?._id
  );

  const departments = ["all", ...new Set(jobs.map((j) => j.department).filter(Boolean))];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === "all" || job.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const jobTabs = [
    { title: "Job Description" },
    { title: "Hiring Workflow" },
    { title: "Eligibility Criteria" },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-130px)] min-h-140 gap-6">
        {/* LEFT PANEL – Job Listings & Filter */}
        <div className="w-full lg:w-5/12 bg-white rounded-2xl border border-slate-100 shadow-xs flex flex-col overflow-hidden">
          {/* Header & Search */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Briefcase size={18} className="text-purple-600" />
                Available Opportunities
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700">
                {filteredJobs.length} Roles
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by role, department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition"
              />
            </div>

            {/* Department Filter Pills */}
            {departments.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs job-profile-scroll">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setDepartmentFilter(dept)}
                    className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition ${
                      departmentFilter === dept
                        ? "bg-purple-600 text-white shadow-2xs"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {dept === "all" ? "All Tracks" : dept}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Job List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 job-profile-scroll overscroll-contain">
            {filteredJobs.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-sm">
                <p className="font-semibold text-slate-600">No matching jobs found</p>
                <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria</p>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const isApplied = appliedJobs.some((a) => a.job?._id === job._id);
                const isSelected = selectedJob?._id === job._id;

                return (
                  <div
                    key={job._id}
                    onClick={() => setSelectedJob(job)}
                    className={`p-4 cursor-pointer transition-all duration-150 relative ${
                      isSelected
                        ? "bg-purple-50/60 border-l-4 border-l-purple-600"
                        : "hover:bg-slate-50/70 border-l-4 border-l-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 leading-snug">
                          {job.title}
                        </h3>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">
                          {job.department || "Technology"} • job-app
                        </p>
                      </div>

                      {isApplied && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
                          <CheckCircle2 size={11} /> Applied
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={13} /> {job.location || "Remote"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={13} /> {job.jobType || "Full-time"}
                      </span>
                      {job.closingDate && (
                        <span className="inline-flex items-center gap-1 ml-auto text-slate-400">
                          Due {new Date(job.closingDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANEL – Detailed Job View */}
        <div className="w-full lg:w-7/12 bg-white rounded-2xl border border-slate-100 shadow-xs flex flex-col overflow-hidden">
          {!selectedJob ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8">
              <Briefcase size={40} className="text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-600">Select a job position</p>
              <p className="text-xs text-slate-400 mt-1">Click any position on the left to read full requirements and apply</p>
            </div>
          ) : (
            <>
              {/* Job Header */}
              <div className="p-6 border-b border-slate-100 bg-linear-to-r from-slate-50/50 to-white">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                      {selectedJob.department || "Engineering"}
                    </span>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">
                      {selectedJob.title}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-2">
                      <span>job-app HQ</span> • 
                      <span className="flex items-center gap-1"><MapPin size={13} /> {selectedJob.location || "Remote"}</span> • 
                      <span>{selectedJob.jobType}</span>
                    </p>
                  </div>

                  {/* Apply Action Button */}
                  <div className="shrink-0">
                    {isSelectedJobApplied ? (
                      <div className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200">
                        <CheckCircle2 size={16} /> Application Submitted
                      </div>
                    ) : (
                      <button
                        onClick={() => applyJob(selectedJob._id)}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md shadow-purple-500/20 hover:shadow-lg transition disabled:opacity-60"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Apply Now
                            <Send size={15} />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Job Highlights Quick Info Bar */}
                <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-slate-400 block font-medium">Experience</span>
                    <span className="font-bold text-slate-700 mt-0.5 block">
                      {selectedJob.experience ? `${selectedJob.experience} Years` : "Freshers / Students"}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-slate-400 block font-medium">Openings</span>
                    <span className="font-bold text-slate-700 mt-0.5 block">
                      {selectedJob.numberOfOpening || 1} Positions
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-slate-400 block font-medium">Application Deadline</span>
                    <span className="font-bold text-slate-700 mt-0.5 block">
                      {selectedJob.closingDate 
                        ? new Date(selectedJob.closingDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
                        : "Open Until Filled"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-100 px-6 gap-6 text-xs font-semibold overflow-x-auto no-scrollbar">
                {jobTabs.map((tab) => (
                  <button
                    key={tab.title}
                    onClick={() => setActiveTab(tab.title)}
                    className={`py-3.5 border-b-2 transition ${
                      activeTab === tab.title
                        ? "border-purple-600 text-purple-600"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>

              {/* Tab Content Body */}
              <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-700 space-y-6 job-profile-scroll overscroll-contain">
                {activeTab === "Job Description" && (
                  <>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Role Overview</h4>
                      <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
                        {selectedJob.description}
                      </p>
                    </div>

                    {selectedJob.skills && (
                      <div>
                        <h4 className="font-bold text-slate-900 mb-2.5">Key Skills & Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.skills.split(",").map((skill, key) => (
                            <span
                              key={key}
                              className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100/80"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedJob.responsibilities && (
                      <div>
                        <h4 className="font-bold text-slate-900 mb-2">Core Responsibilities</h4>
                        <ul className="space-y-2">
                          {selectedJob.responsibilities.split(",").map((resp, key) => (
                            <li key={key} className="flex items-start gap-2 text-slate-600 text-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 shrink-0"></span>
                              <span>{resp.trim()}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}

                {activeTab === "Hiring Workflow" && (
                  <div>
                    <h4 className="font-bold text-slate-900 mb-4">Selection Process</h4>
                    {selectedJob.hiringWorkflow ? (
                      <div className="space-y-3">
                        {selectedJob.hiringWorkflow.split(",").map((step, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-sm font-semibold text-slate-700">{step.trim()}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">1. Resume Screening → 2. Technical Interview → 3. Final Offer</p>
                    )}
                  </div>
                )}

                {activeTab === "Eligibility Criteria" && (
                  <div>
                    <h4 className="font-bold text-slate-900 mb-4">Applicant Requirements</h4>
                    {selectedJob.eligibilityCriteria ? (
                      <ul className="space-y-2.5">
                        {selectedJob.eligibilityCriteria.split(",").map((crit, key) => (
                          <li key={key} className="flex items-start gap-2 text-slate-600 text-sm">
                            <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                            <span>{crit.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400">Standard educational qualifications and relevant domain skills required.</p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobProfile;
