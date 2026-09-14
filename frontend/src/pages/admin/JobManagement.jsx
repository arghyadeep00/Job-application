import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useForm } from "react-hook-form";
import { Cross, Plus, X } from "lucide-react";
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
      const response = await api.post("/job/post-job", data);

      reset();
      toast.success(response.data.message);
      fetchJobs();

      setShowForm(false);

    } catch (error) {
      toast.error("Can't post job");
    }
  };

  // edit job details
  const [editJobDetatils, setEditJobDetails] = useState();

  const handleEditJob = async (id) => {
    setEditJob(true);
    const jobDetails = jobs.find((e) => e._id === id);
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
      const response = await api.patch(
        "/job/update-job-details",
        editJobDetatils,
      );
      setEditJob(false);
      fetchJobs();
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // delete job

  const deleteJob = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you want to delete the job !",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`/job/delete-job/${id}`);
          fetchJobs();
          toast.success(response.data.message);
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to delete job");
        }
      }
    });
  };




  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Job Management
          </h1>
          <p className="text-sm text-gray-500">
            Create and manage job postings
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 flex items-center gap-1 text-white px-5 py-2 rounded-lg text-sm hover:bg-purple-700 cursor-pointer font-semibold"
        >
          <Plus className="w-5" /> Add New Job
        </button>
      </div>

      {/* Add Job Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Create Job Post</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="">
                <input
                  type="text"
                  placeholder="Job title"
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 
                    ${errors.jobtitle
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                    }`}
                  {...register("jobtitle", {
                    required: "Job title is required",
                  })}
                />
                {errors.jobtitle && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.jobtitle.message}
                  </p>
                )}
              </div>
              <div className="">
                <input
                  type="text"
                  placeholder="Department"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500 "
                  {...register("department")}
                />
              </div>
              {/* job type */}
              <div>
                <select
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 ${errors.jobtype
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                    }`}
                  {...register("jobtype", {
                    required: "Please select job type",
                  })}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a Job type
                  </option>
                  <option value="Full Time">Full time</option>
                  <option value="Part Time">Part time</option>
                  <option value="Remote">Remote</option>
                  <option value="Internship">Internship</option>
                </select>
                {errors.jobtype && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.jobtype.message}
                  </p>
                )}
              </div>
              {/* experience */}
              <div>
                <input
                  type="number"
                  placeholder="Experience 2+ year"
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 ${errors.experience
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                    }`}
                  {...register("experience", {
                    required: "Experice is is required",
                  })}
                />
                {errors.experience && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.experience.message}
                  </p>
                )}
              </div>
              <div>
                {/* location  */}
                <input
                  type="text"
                  placeholder="Location"
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 
                    ${errors.jobtitle
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                    }`}
                  {...register("location", { required: "Location is require" })}
                />
                {errors.location && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.location.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Number of openings"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500 "
                  {...register("openingjobs")}
                />
              </div>
            </div>

            {/* eligibilityCriteria */}
            <textarea
              rows="4"
              placeholder="Eligibility Criteria (comma separated)"
              className={`w-full mt-5 px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 ${errors.eligibilityCriteria
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                }`}
              {...register("eligibilityCriteria", {
                required: "Job description is required",
              })}
            ></textarea>
            {errors.eligibilityCriteria && (
              <p className="text-sm text-red-500 mt-1">
                {errors.eligibilityCriteria.message}
              </p>
            )}

            {/*  HiringWorkflow */}
            <textarea
              rows="4"
              placeholder="Hiring Workflow"
              className={`w-full mt-5 px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 ${errors.hiringWorkflow
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                }`}
              {...register("hiringWorkflow", {
                required: "Job description is required",
              })}
            ></textarea>
            {errors.hiringWorkflow && (
              <p className="text-sm text-red-500 mt-1">
                {errors.hiringWorkflow.message}
              </p>
            )}


            {/* closing Date   */}
            <div className="flex items-center justify-between mt-4 gap-1">
              <label
                htmlFor="closingDate"
                className="text-sm flex w-full font-medium text-gray-500"
              >
                Closing Date
                <input
                  type="date"
                  id="closingDate"
                  name="closingDate"
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 ${errors.closingdate
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                    }`}
                  {...register("closingdate", {
                    required: "Closing date is require"
                  })}
                />{" "}
              </label>
            </div>

            {/* job description */}
            <textarea
              rows="4"
              placeholder="Job Description"
              className={`w-full mt-5 px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 ${errors.jobdescription
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                }`}
              {...register("jobdescription", {
                required: "Job description is required",
              })}
            ></textarea>
            {errors.jobdescription && (
              <p className="text-sm text-red-500 mt-1">
                {errors.jobdescription.message}
              </p>
            )}

            {/* require skills */}
            <textarea
              rows="3"
              placeholder="Required Skills (comma separated)"
              className={`w-full mt-5 px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 ${errors.skills
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                }`}
              {...register("skills", {
                required: "Skills are is required",
              })}
            ></textarea>
            {errors.skills && (
              <p className="text-sm text-red-500 mt-1">
                {errors.skills.message}
              </p>
            )}
            {/* cancle button */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowForm(false)}
                className="border px-5 py-2 font-semibold rounded-lg text-sm border-gray-400 cursor-pointer"
              >
                Cancel
              </button>

              {/* publish job */}
              <button
                type="submit"
                className="bg-green-600 text-white font-semibold px-5 py-2 rounded-lg text-sm hover:bg-green-700 cursor-pointer"
              >
                Publish Job
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Job Listings */}
      {jobs.length == 0 ? (
        <div className="text-center">
          <p>No job post</p>
        </div>
      ) : (
        <div className="bg-white rounded-md shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead className="border-b border-gray-300 bg-gray-50">
              <tr className="text-gray-600">
                <th className="px-4 py-3">Job Title</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Openings</th>
                <th className="px-4 py-3">Experience</th>
                <th className="px-4 py-3">Opening Date</th>
                <th className="px-4 py-3">Closing Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((e) => (
                <tr key={e._id}>
                  <td className="px-4 py-3">{e?.title}</td>
                  <td className="px-4 py-3">{e.department || "-"}</td>
                  <td className="px-4 py-3">{e?.jobType}</td>
                  <td className="px-4 py-3">{e?.location}</td>
                  <td className="px-4 py-3">{e?.numberOfOpening}</td>
                  <td className="px-4 py-3">
                    {e.experience || 0} Year
                  </td>
                  <td className="px-4 py-3">
                    {new Date(e?.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(e?.closingDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(e?.closingDate) < new Date() ? (
                      <span className="inline-block px-2 py-1 text-xs rounded bg-red-100 text-red-700">
                        Closed
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                        Open
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 space-x-4">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleEditJob(e._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => deleteJob(e._id)}
                    >
                      delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          
          </table>
        
         
        </div>
      )}
      {/* edit posted job details  */}
      {editJob && editJobDetatils && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setEditJob(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-5xl p-6">
            <h2 className="text-lg font-semibold mb-6 text-gray-700">
              Update Job Details
            </h2>

            <form
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              onSubmit={handleOnSubmit}
            >
              {/* Job Title */}
              <div>
                <label className="text-sm text-gray-600">Job Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter job title"
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
                <label className="text-sm text-gray-600">Department</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter department"
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
                <label className="text-sm text-gray-600">Job Type</label>
                <select
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
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
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="text-sm text-gray-600">Location</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Job location"
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
                <label className="text-sm text-gray-600">Openings</label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
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
                <label className="text-sm text-gray-600">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g. 1"
                  value={editJobDetatils?.experience || 0}
                  onChange={(e) =>
                    setEditJobDetails({
                      ...editJobDetatils,
                      experience: e.target.value,
                    })
                  }
                />
              </div>

              {/* Opening Date */}
              <div>
                <label className="text-sm text-gray-600">Opening Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                  disabled
                  value={
                    editJobDetatils.createdAt
                      ? new Date(editJobDetatils.createdAt)
                        .toISOString()
                        .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setEditJobDetails({
                      ...editJobDetatils,
                      createdAt: e.target.value,
                    })
                  }
                />
              </div>

              {/* Closing Date */}
              <div>
                <label className="text-sm text-gray-600">Closing Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
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

              {/* Status */}
              <div>
                <label className="text-sm text-gray-600">Job Status</label>
                <select
                  disabled
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option>Open</option>
                  <option>Closed</option>
                  <option>Paused</option>
                </select>
              </div>

              {/* description */}
              <div>
                <label className="text-sm text-gray-600">Description</label>
                <textarea
                  role="4"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                  value={editJobDetatils.description}
                  onChange={(e) =>
                    setEditJobDetails({
                      ...editJobDetatils,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              {/* hiringWorkflow */}
              <div>
                <label className="text-sm text-gray-600">Hiring Workflow</label>
                <textarea
                  role="4"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
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
                <label className="text-sm text-gray-600">Eligibility Criteria</label>
                <textarea
                  role="4"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                  value={editJobDetatils.eligibilityCriteria}
                  onChange={(e) =>
                    setEditJobDetails({
                      ...editJobDetatils,
                      eligibilityCriteria: e.target.value,
                    })
                  }
                />
              </div>

              {/* skills */}
              <div>
                <label className="text-sm text-gray-600">Skills</label>
                <textarea
                  role="4"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                  value={editJobDetatils.skills}
                  onChange={(e) =>
                    setEditJobDetails({
                      ...editJobDetatils,
                      skills: e.target.value,
                    })
                  }
                />
              </div>
              {/* Responsibilities */}
              <div>
                <label className="text-sm text-gray-600">Responsibilities</label>
                <textarea
                  role="4"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                  value={editJobDetatils.responsibilities}
                  onChange={(e) =>
                    setEditJobDetails({
                      ...editJobDetatils,
                      responsibilities: e.target.value,
                    })
                  }
                />
              </div>

              {/* Actions */}
              <div className="flex w-full justify-end col-span-1 md:col-span-2 lg:col-span-3 gap-3 mt-6">
                <button
                  className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                  onClick={() => setEditJob(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                >
                  Update Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default JobManagement;
