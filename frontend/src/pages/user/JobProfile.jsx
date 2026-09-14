import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import toast from "react-hot-toast";

const JobProfile = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    try {

      const response = await api.get("/job/all-jobs");
      setJobs(response.data.resultData);
      // auto-select first job
      if (response.data.resultData.length > 0) {
        setSelectedJob(response.data.resultData[0]);
      }
    } catch (error) {
      toast.error("Fetching job error");
    }
  };
  const fetchAppliedJobs = async () => {
    try {
      const res = await api.get("/job/fetch-applied-jobs");
      setAppliedJobs(res.data.resultData);
    } catch (error) {
      toast.error(error.response.data.message || "Job fetch error");
    }
  };

  const applyJob = async (id) => {
    try {
      setLoading(true)
      const response = await api.post("/job/apply-job", { id });
      toast.success(response.data.message);
      fetchJobs();
      fetchAppliedJobs();
    } catch (error) {
      toast.error(error.response.data.message || "Can't post job");
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, []);

  const isSelectedJobApplied = appliedJobs.some(
    (applied) => applied.job?._id === selectedJob?._id,
  );

  // job description || highiring workflow || eligibility criteria tabs 
  const [activeTab, setActiveTab] = useState("Job Description");

  const jobTabs = [
    {
      title: "Job Description"
    },
    {
      title: "Hiring Workflow"
    },
    {
      title: "Eligibility Criteria"
    }
  ]

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-80px)] gap-4">
        {/* LEFT PANEL – Job List */}
        <div className="w-1/3 rounded-lg bg-white overflow-y-auto shadow-xl">
          <div className="p-4 border-b border-gray-300 font-semibold text-lg">
            Open Jobs
          </div>

          {jobs.map((job) => (
            <div
              key={job._id}
              onClick={() => setSelectedJob(job)}
              className={`p-4 cursor-pointer
                ${selectedJob?._id === job._id ? "bg-blue-50" : "hover:bg-gray-50"}
              `}
            >
              <div className="flex justify-between">
                {" "}
                <h3 className="font-medium">{job.title}</h3>
                <p className="text-sm text-gray-600">
                  Published:{" "}
                  {job.createdAt
                    ? new Date(job.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    : ""}{" "}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                {job.jobType} • {job.location}
              </p>

              {appliedJobs.some((applied) => applied.job?._id === job._id) && (
                <span className="inline-block mt-2 text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                  Applied
                </span>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT PANEL – Job Details */}
        <div className="w-2/3 rounded-lg bg-white overflow-y-auto shadow-xl">
          {!selectedJob ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a job to view details
            </div>
          ) : (
            <>
              <div className="p-6 border-b border-gray-300 flex justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{selectedJob.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedJob.company} • {selectedJob.location} •{" "}
                    {selectedJob.jobType}
                  </p>
                </div>

                <div className="text-sm text-red-500">
                  Closing:{" "}
                  {selectedJob.closingDate
                    ? new Date(selectedJob.closingDate).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )
                    : ""}{" "}
                </div>
              </div>

              {/* Tabs */}
              <div className="flex justify-between px-6 text-sm font-medium">
                <div className="flex gap-6">
                  {jobTabs.map((tab, key) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(tab.title)}
                      className={`py-3 border-b-2 ${activeTab === tab.title
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500"
                        }`}
                    >
                      {tab.title}
                    </button>
                  ))}
                </div>
                {isSelectedJobApplied ? (
                  <div className="px-4 py-2 mt-3 rounded bg-green-100 text-green-700 font-semibold cursor-not-allowed">
                    Applied
                  </div>
                ) : (
                  <button
                    onClick={() => applyJob(selectedJob._id)}
                    className={`px-4 py-2 mt-3 rounded  font-semibold text-white hover:bg-purple-600 ${loading ? "bg-purple-600" : "bg-purple-500"}`}
                    disabled={loading}
                  >
                    {
                      loading ? "Applying..." : "Apply now"
                    }
                  </button>
                )}
              </div>

              {/* Job Description */}
              {
                activeTab === "Job Description" && (
                  <div className="p-6 text-sm text-gray-700 space-y-4">
                    <div>
                      <h4 className="font-semibold">Job Description</h4>
                      <p className="py-2">
                        {selectedJob?.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold py-2">Required skills</h4>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {selectedJob?.skills?.split(",")
                          .map((skill, key) => (
                            <span
                              key={key}
                              className="px-3 py-1 rounded-lg text-sm font-medium
                           bg-blue-100 text-blue-700
                             border border-blue-200
                           hover:bg-blue-200 transition"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                      </div>

                    </div>

                    <div>
                      <h4 className="font-semibold py-4">Responsibilities</h4>
                      <ul className="list-disc ml-5 space-y-1">
                        {selectedJob?.responsibilities?.split(",")
                          .map((e, key) => (
                            <li className="text-sm" key={key}>
                              {e.trim()}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                )
              }
              {/* Hiring Workflow */}
              {
                activeTab === "Hiring Workflow" && (
                  <div className="p-6 text-sm text-gray-700 space-y-4">
                    <div>
                      <h4 className="font-semibold">Workflow</h4>
                      <ul className="list-disc ml-5 space-y-1">
                        {selectedJob?.hiringWorkflow?.split(",").map((e, key) => (
                          <li className="text-sm my-3">{e.trim()}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              }
              {/* Eligibility Criteria */}
              {
                activeTab === "Eligibility Criteria" && (
                  <div className="p-6 text-sm text-gray-700 space-y-4">
                    <div>
                      <h4 className="font-semibold">Eligibility Criteria</h4>
                      <ul className="list-disc ml-5 space-y-1">
                        {selectedJob?.eligibilityCriteria?.split(",").map((e, key) => (
                          <li className="text-sm my-3">{e.trim()}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              }
            </>
          )}
        </div>
      </div>
    </DashboardLayout >
  );
};

export default JobProfile;
