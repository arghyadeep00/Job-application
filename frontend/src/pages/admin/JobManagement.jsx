import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useForm } from "react-hook-form";
import {
  Plus,
  X,
  Briefcase,
  MapPin,
  Users,
  Calendar,
  Edit3,
  Trash2,
  Clock,
  Building2,
  Sparkles,
  Layers,
  FileText,
  CheckCircle2,
} from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useAdminGlobal } from "../../context/AdminContext";
import Swal from "sweetalert2";

const JobManagement = () => {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editJob, setEditJob] = useState(false);
  const { jobs, fetchJobs } = useAdminGlobal();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // post new job
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await api.post("/job/post-job", data);

      reset();
      toast.success(response.data.message || "Job posted successfully!");
      fetchJobs();
      setShowForm(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Can't post job");
    } finally {
      setLoading(false);
    }
  };

  // edit job details
  const [editJobDetatils, setEditJobDetails] = useState();

  const handleEditJob = async (id) => {
    setEditJob(true);
    const jobDetails = jobs.find((e) => e._id === id);
    if (!jobDetails) return;
    setEditJobDetails({
      id: id,
      title: jobDetails.title || "",
      department: jobDetails.department || "",
      jobType: jobDetails.jobType || "",
      location: jobDetails.location || "",
      numberOfOpening: jobDetails.numberOfOpening || "",
      description: jobDetails.description || "",
      eligibilityCriteria: jobDetails.eligibilityCriteria || "",
      hiringWorkflow: jobDetails.hiringWorkflow || "",
      skills: jobDetails.skills || "",
      experience: jobDetails.experience || "",
      responsibilities: jobDetails.responsibilities || "",
      createdAt: jobDetails.createdAt || "",
      closingDate: jobDetails.closingDate || "",
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.patch(
        "/job/update-job-details",
        editJobDetatils
      );
      setEditJob(false);
      fetchJobs();
      toast.success(response.data.message || "Job updated successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // delete job
  const deleteJob = (id) => {
    Swal.fire({
      title: "Delete this posting?",
      text: "This action cannot be undone and will remove the job post.",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#94a3b8",
      confirmButtonColor: "#e11d48",
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, delete",
      customClass: {
        popup: "rounded-2xl font-sans",
        confirmButton: "rounded-xl font-medium px-4 py-2",
        cancelButton: "rounded-xl font-medium px-4 py-2",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`/job/delete-job/${id}`);
          fetchJobs();
          toast.success(response.data.message || "Job removed");
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to delete job");
        }
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Job Management
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
                {jobs.length} Active Positions
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Create, update, and manage open career requisitions across your organization.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm shadow-indigo-500/25 cursor-pointer"
          >
            {showForm ? (
              <>
                <X className="w-4 h-4" /> Close Form
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Add New Job
              </>
            )}
          </button>
        </div>

        {/* Add Job Form Drawer / Card */}
        {showForm && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-indigo-100 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Create New Job Posting
                  </h2>
                  <p className="text-xs text-slate-500">
                    Fill in the position specifications and requirements for candidates.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Core Position Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Job Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Job Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Frontend Engineer"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.jobtitle
                        ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500"
                        : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                    {...register("jobtitle", {
                      required: "Job title is required",
                    })}
                  />
                  {errors.jobtitle && (
                    <p className="text-xs text-rose-500 mt-1">
                      {errors.jobtitle.message}
                    </p>
                  )}
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Engineering, Product, Design"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    {...register("department")}
                  />
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Employment Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                      errors.jobtype
                        ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500"
                        : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                    {...register("jobtype", {
                      required: "Please select job type",
                    })}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select employment type
                    </option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Remote">Remote</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                  {errors.jobtype && (
                    <p className="text-xs text-rose-500 mt-1">
                      {errors.jobtype.message}
                    </p>
                  )}
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Experience Required (Years) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 2"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.experience
                        ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500"
                        : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                    {...register("experience", {
                      required: "Experience is required",
                    })}
                  />
                  {errors.experience && (
                    <p className="text-xs text-rose-500 mt-1">
                      {errors.experience.message}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Location <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bangalore, India (or Remote)"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.location
                        ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500"
                        : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                    {...register("location", {
                      required: "Location is required",
                    })}
                  />
                  {errors.location && (
                    <p className="text-xs text-rose-500 mt-1">
                      {errors.location.message}
                    </p>
                  )}
                </div>

                {/* Openings */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Number of Openings
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 3"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    {...register("openingjobs")}
                  />
                </div>
              </div>

              {/* Closing Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Application Deadline / Closing Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full max-w-sm px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                    errors.closingdate
                      ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500"
                      : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                  }`}
                  {...register("closingdate", {
                    required: "Closing date is required",
                  })}
                />
                {errors.closingdate && (
                  <p className="text-xs text-rose-500 mt-1">
                    {errors.closingdate.message}
                  </p>
                )}
              </div>

              {/* Textareas */}
              <div className="space-y-4">
                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Job Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Detailed overview of the role, team, and day-to-day impact..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.jobdescription
                        ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500"
                        : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                    {...register("jobdescription", {
                      required: "Job description is required",
                    })}
                  />
                  {errors.jobdescription && (
                    <p className="text-xs text-rose-500 mt-1">
                      {errors.jobdescription.message}
                    </p>
                  )}
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Required Skills (Comma separated) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows="2"
                    placeholder="e.g. React, TypeScript, Node.js, Tailwind CSS, PostgreSQL"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.skills
                        ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500"
                        : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                    {...register("skills", {
                      required: "Skills are required",
                    })}
                  />
                  {errors.skills && (
                    <p className="text-xs text-rose-500 mt-1">
                      {errors.skills.message}
                    </p>
                  )}
                </div>

                {/* Eligibility Criteria */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Eligibility Criteria <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows="2"
                    placeholder="e.g. Bachelor's in CS or equivalent, 2+ years working with scalable SPAs..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.eligibilityCriteria
                        ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500"
                        : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                    {...register("eligibilityCriteria", {
                      required: "Eligibility criteria is required",
                    })}
                  />
                  {errors.eligibilityCriteria && (
                    <p className="text-xs text-rose-500 mt-1">
                      {errors.eligibilityCriteria.message}
                    </p>
                  )}
                </div>

                {/* Hiring Workflow */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Hiring Workflow <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows="2"
                    placeholder="e.g. Resume Screening -> Technical Interview -> System Design -> HR Round"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.hiringWorkflow
                        ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500"
                        : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                    {...register("hiringWorkflow", {
                      required: "Hiring workflow is required",
                    })}
                  />
                  {errors.hiringWorkflow && (
                    <p className="text-xs text-rose-500 mt-1">
                      {errors.hiringWorkflow.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all shadow-sm shadow-emerald-500/20 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Publish Job Post
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Job Listings Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {jobs.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3 border border-indigo-100">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                No job postings yet
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Get started by creating your company's first job opening to start receiving candidates.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Create Opening
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-5 py-3.5">Job Title</th>
                    <th className="px-5 py-3.5">Department</th>
                    <th className="px-5 py-3.5">Type</th>
                    <th className="px-5 py-3.5">Location</th>
                    <th className="px-5 py-3.5 text-center">Openings</th>
                    <th className="px-5 py-3.5">Experience</th>
                    <th className="px-5 py-3.5">Deadline</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-sm">
                  {jobs.map((job) => {
                    const isExpired =
                      job?.closingDate && new Date(job.closingDate) < new Date();

                    return (
                      <tr
                        key={job._id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        {/* Title */}
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-900">
                            {job?.title}
                          </div>
                          <div className="text-xs text-slate-400">
                            Posted{" "}
                            {job?.createdAt
                              ? new Date(job.createdAt).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                })
                              : "-"}
                          </div>
                        </td>

                        {/* Department */}
                        <td className="px-5 py-4 text-slate-600">
                          {job.department || "General"}
                        </td>

                        {/* Job Type */}
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            {job?.jobType}
                          </span>
                        </td>

                        {/* Location */}
                        <td className="px-5 py-4 text-slate-600">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {job?.location}
                          </span>
                        </td>

                        {/* Openings */}
                        <td className="px-5 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100">
                            {job?.numberOfOpening || 1}
                          </span>
                        </td>

                        {/* Experience */}
                        <td className="px-5 py-4 text-slate-600">
                          {job.experience || 0} yr(s)
                        </td>

                        {/* Deadline */}
                        <td className="px-5 py-4 text-xs text-slate-500">
                          {job?.closingDate
                            ? new Date(job.closingDate).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          {isExpired ? (
                            <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                              Closed
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Open
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditJob(job._id)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                              title="Edit position"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteJob(job._id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete position"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit Posted Job Details Modal */}
        {editJob && editJobDetatils && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
              onClick={() => setEditJob(false)}
            />

            {/* Modal Box */}
            <div className="relative z-50 bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Update Job Details
                  </h2>
                  <p className="text-xs text-slate-500">
                    Editing position: {editJobDetatils.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditJob(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form className="space-y-5" onSubmit={handleOnSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Job Title */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      value={editJobDetatils.title}
                      onChange={(e) =>
                        setEditJobDetails({
                          ...editJobDetatils,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      value={editJobDetatils.department}
                      onChange={(e) =>
                        setEditJobDetails({
                          ...editJobDetatils,
                          department: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Job Type */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Job Type
                    </label>
                    <select
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      value={editJobDetatils.jobType}
                      onChange={(e) =>
                        setEditJobDetails({
                          ...editJobDetatils,
                          jobType: e.target.value,
                        })
                      }
                    >
                      <option value="">Select type</option>
                      <option>Full Time</option>
                      <option>Part Time</option>
                      <option>Internship</option>
                      <option>Contract</option>
                      <option>Remote</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      value={editJobDetatils.location}
                      onChange={(e) =>
                        setEditJobDetails({
                          ...editJobDetatils,
                          location: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Openings */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Openings
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      value={editJobDetatils.numberOfOpening}
                      onChange={(e) =>
                        setEditJobDetails({
                          ...editJobDetatils,
                          numberOfOpening: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      value={editJobDetatils?.experience || 0}
                      onChange={(e) =>
                        setEditJobDetails({
                          ...editJobDetatils,
                          experience: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Closing Date */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Closing Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      value={
                        editJobDetatils.closingDate
                          ? new Date(editJobDetatils.closingDate)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setEditJobDetails({
                          ...editJobDetatils,
                          closingDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Textareas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* description */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows="3"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      value={editJobDetatils.description}
                      onChange={(e) =>
                        setEditJobDetails({
                          ...editJobDetatils,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* skills */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Skills
                    </label>
                    <textarea
                      rows="3"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      value={editJobDetatils.skills}
                      onChange={(e) =>
                        setEditJobDetails({
                          ...editJobDetatils,
                          skills: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* hiringWorkflow */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hiring Workflow
                    </label>
                    <textarea
                      rows="3"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      value={editJobDetatils.hiringWorkflow}
                      onChange={(e) =>
                        setEditJobDetails({
                          ...editJobDetatils,
                          hiringWorkflow: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* eligibilityCriteria */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Eligibility Criteria
                    </label>
                    <textarea
                      rows="3"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      value={editJobDetatils.eligibilityCriteria}
                      onChange={(e) =>
                        setEditJobDetails({
                          ...editJobDetatils,
                          eligibilityCriteria: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    onClick={() => setEditJob(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm shadow-indigo-500/25 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? "Updating..." : "Update Job"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default JobManagement;

