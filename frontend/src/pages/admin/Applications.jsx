import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useRef, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import statusColor from "../../styles/statusColor";
import { useNavigate } from "react-router-dom";
import domain from "../../utils/domain";

const Applications = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [shortlistLoading, setShortlistLoading] = useState(false);

  const [applications, setApplications] = useState([]);
  const [editStatus, setEditStatus] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState([]);

  // filter states
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [userDomain, setUserDomain] = useState("");
  const filterOnClick = async () => {
    try {
      const response = await api.get("/application/search-application", {
        params: {
          search,
          status,
          domain: userDomain,
        },
      });
      setApplications(response.data.resultData);
    } catch (error) {
      console.log(error);
      toast.error("can't find");
    }
  };

  // one application set a variable for update
  const userStatusUpdate = (id) => {
    setEditStatus(true);
    setSelectedApplication(applications.find((e) => e._id === id));
  };

  // change status
  const updateStatus = async (status, applicationId, email, firstname, jobId) => {
    try {
      setLoading(true);
      if (status === "Shortlisted") {
        setShortlistLoading(true);
      }
      if (status === "Rejected") {
        setRejectLoading(true);
      }
      const response = await api.patch("/application/update-status", {
        status,
        applicationId,
        email,
        firstname,
        jobId
      });

      toast.success(response.data.message);
      fetchApplications();
    } catch (error) {
      toast.error("Status update filed");
    } finally {
      setLoading(false)
      setShortlistLoading(false);
      setRejectLoading(false);
      setEditStatus(false);
    }
  };

  // pagination code
  const [totalPages, setTotalPages] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);

  const fetchApplications = async () => {
    const res = await api.get(
      `/application/applications?page=${currentPage}&limit=${limit}`,
    );
    setApplications(res.data.applications);
    setTotalPages(res.data.totalPages);
  };
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    fetchApplications();
    hasFetched.current = true;
  }, [currentPage]);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // reset search data
  const resetBtn = () => {
    setSearch("");
    setStatus("");
    setUserDomain("");
    fetchApplications();
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Applicant Pipeline
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review, filter, and update candidate applications across all posted jobs
        </p>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs mb-6 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-50">
          <input
            type="text"
            placeholder="Search candidate name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition"
          />
        </div>

        <select
          className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 text-slate-700 transition cursor-pointer"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 text-slate-700 transition cursor-pointer"
          value={userDomain}
          onChange={(e) => setUserDomain(e.target.value)}
        >
          <option value="">All Domains</option>
          {domain.map((item, key) => (
            <option value={item?.value} key={key}>
              {item?.title}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-purple-700 transition shadow-xs"
            onClick={filterOnClick}
          >
            Apply Filter
          </button>
          <button
            className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-200 transition"
            onClick={resetBtn}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {applications.length === 0 ? (
          <div className="text-center p-12 text-slate-400">
            <p className="font-semibold text-slate-700 text-base">No applicants match your criteria</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting filters or searching with different keywords</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Candidate</th>
                  <th className="px-6 py-4">Job Title</th>
                  <th className="px-6 py-4">Domain</th>
                  <th className="px-6 py-4">Resume</th>
                  <th className="px-6 py-4">Experience</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {applications.map((e) => {
                  const fullName = [e?.user?.firstname, e?.user?.middlename, e?.user?.lastname]
                    .filter(Boolean)
                    .join(" ") || "Candidate";
                  const initial = e?.user?.firstname?.charAt(0) || "C";

                  return (
                    <tr
                      key={e._id}
                      className="hover:bg-purple-50/40 cursor-pointer transition"
                      onClick={() => navigate(`/admin/user-profile/${e?.user?._id}`)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {initial}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{fullName}</div>
                            <div className="text-xs text-slate-400">{e?.user?.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800 text-xs">
                          {e?.job?.title || "Position"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {e?.user?.domain || "General"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {e?.user?.resume?.url ? (
                          <button
                            className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-800 hover:underline"
                            onClick={(event) => {
                              event.stopPropagation();
                              window.open(
                                `https://docs.google.com/gview?url=${e?.user?.resume?.url}&embedded=true`,
                                "_blank"
                              );
                            }}
                          >
                            View CV
                          </button>
                        ) : (
                          <span className="text-slate-300 text-xs">None</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-600">
                        {e?.user?.experience?.year || 0} Years
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 text-xs rounded-full ${statusColor[e?.status]}`}>
                          {e?.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(e?.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-semibold text-xs transition"
                          onClick={(event) => {
                            event.stopPropagation();
                            userStatusUpdate(e._id);
                          }}
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-end items-center gap-2">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition"
        >
          Previous
        </button>

        <span className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white shadow-2xs">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition"
        >
          Next
        </button>
      </div>

      {/* Update Status Modal */}
      {editStatus && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setEditStatus(false)}
          />

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 border border-slate-100 z-10 animate-in fade-in zoom-in-95">
            <h2 className="text-xl font-bold text-slate-800 mb-1">
              Update Candidate Status
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Decision will notify the applicant via automatic email
            </p>

            {/* Candidate Box */}
            <div className="mb-4 bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs space-y-1.5">
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Candidate Details</p>
              <p className="text-sm font-bold text-slate-800">
                {selectedApplication?.user?.firstname} {selectedApplication?.user?.lastname}
              </p>
              <p className="text-slate-500">{selectedApplication?.user?.email}</p>
            </div>

            {/* Job Box */}
            <div className="mb-6 bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs space-y-1.5">
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Position</p>
              <p className="text-sm font-bold text-purple-700">
                {selectedApplication?.job?.title}
              </p>
              <p className="text-slate-500">{selectedApplication?.job?.department || "General"} Department</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() =>
                  updateStatus(
                    "Rejected",
                    selectedApplication._id,
                    selectedApplication?.user?.email,
                    selectedApplication?.user?.firstname,
                    selectedApplication?.job?._id
                  )
                }
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs transition disabled:opacity-60"
              >
                {rejectLoading ? "Rejecting..." : "Mark as Rejected"}
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    "Shortlisted",
                    selectedApplication._id,
                    selectedApplication?.user?.email,
                    selectedApplication?.user?.firstname,
                    selectedApplication?.job?._id
                  )
                }
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 transition disabled:opacity-60"
              >
                {shortlistLoading ? "Shortlisting..." : "Shortlist Candidate"}
              </button>
            </div>

            <button
              onClick={() => setEditStatus(false)}
              className="w-full mt-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Applications;
