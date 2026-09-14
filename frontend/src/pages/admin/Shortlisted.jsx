import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import statusColor from "../../styles/statusColor";
import toast from "react-hot-toast";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  FileText,
  ExternalLink,
  UserCheck,
  Search,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Briefcase,
} from "lucide-react";

const Shortlisted = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [applicationId, setApplicationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Interview form state
  const [interviewData, setInterviewData] = useState({
    date: "",
    time: "",
    mode: "Online",
    meetLink: "",
    location: "",
    notes: "",
  });

  const fetchShortListed = async () => {
    try {
      const response = await api.get("/application/shortlisted-applicants");
      setApplications(response.data.resultData || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load shortlisted applicants");
    }
  };

  useEffect(() => {
    fetchShortListed();
  }, []);

  const handleChange = (e) => {
    setInterviewData({
      ...interviewData,
      [e.target.name]: e.target.value,
    });
  };

  const combineDateTime = (date, time) => {
    return new Date(`${date}T${time}`);
  };

  const openScheduleModal = (e, app) => {
    e.stopPropagation();
    setSelectedCandidate(app);
    setJobId(app?.job?._id);
    setUserId(app?.user?._id);
    setApplicationId(app?._id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    try {
      if (!interviewData.date || !interviewData.time || !interviewData.mode) {
        return toast.error("Please fill all required date, time and mode fields");
      }

      if (interviewData.mode === "Online" && !interviewData.meetLink) {
        return toast.error("Please enter a meeting link (e.g. Google Meet)");
      }

      if (interviewData.mode === "Offline" && !interviewData.location) {
        return toast.error("Please enter the interview location / office address");
      }

      const interviewDate = combineDateTime(
        interviewData.date,
        interviewData.time
      );
      setLoading(true);
      const response = await api.post("/interview/schedule", {
        applicantId: userId,
        jobId,
        interviewDate,
        interviewData,
        applicationId,
      });

      fetchShortListed();
      toast.success(response.data.message || "Interview scheduled successfully!");
      setShowModal(false);

      // reset form
      setInterviewData({
        date: "",
        time: "",
        mode: "Online",
        meetLink: "",
        location: "",
        notes: "",
      });
      setSelectedCandidate(null);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Interview schedule failed");
    } finally {
      setLoading(false);
    }
  };

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const fullName = `${app?.user?.firstname || ""} ${app?.user?.lastname || ""}`.toLowerCase();
    const jobTitle = (app?.job?.title || "").toLowerCase();
    const email = (app?.user?.email || "").toLowerCase();
    const domain = (app?.user?.domain || "").toLowerCase();
    const query = searchTerm.toLowerCase().trim();
    return (
      fullName.includes(query) ||
      jobTitle.includes(query) ||
      email.includes(query) ||
      domain.includes(query)
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Shortlisted Candidates
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                {applications.length} Qualified
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Candidates who passed preliminary screening and are ready for interview scheduling.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search candidate, job, domain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Candidates Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {applications.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3 border border-indigo-100">
                <UserCheck className="w-7 h-7" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                No shortlisted candidates yet
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Review incoming applications and mark qualified candidates as "Shortlisted" to schedule interviews.
              </p>
              <button
                onClick={() => navigate("/admin/applications")}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
              >
                Go to Applications
              </button>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-sm font-medium text-slate-600">
                No candidates match your search "{searchTerm}"
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                Clear filter
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-5 py-3.5">Candidate</th>
                    <th className="px-5 py-3.5">Applied Role</th>
                    <th className="px-5 py-3.5">Domain</th>
                    <th className="px-5 py-3.5">Experience</th>
                    <th className="px-5 py-3.5">Resume</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Applied Date</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredApps.map((app) => {
                    const initials =
                      (app?.user?.firstname?.[0] || "") +
                      (app?.user?.lastname?.[0] || "U");
                    const fullName =
                      [app?.user?.firstname, app?.user?.middlename, app?.user?.lastname]
                        .filter(Boolean)
                        .join(" ") || "Candidate";

                    return (
                      <tr
                        key={app._id}
                        onClick={() => navigate(`/admin/user-profile/${app?.user?._id}`)}
                        className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      >
                        {/* Candidate Identity */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-xs shrink-0">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                                {fullName}
                              </p>
                              <p className="text-xs text-slate-500 truncate">
                                {app?.user?.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Job Title */}
                        <td className="px-5 py-4">
                          <span className="font-medium text-slate-900 flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                            {app?.job?.title || "Unknown Role"}
                          </span>
                        </td>

                        {/* Domain */}
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            {app?.user?.domain || "General"}
                          </span>
                        </td>

                        {/* Experience */}
                        <td className="px-5 py-4 text-slate-700">
                          {app?.user?.experience?.year
                            ? `${app?.user?.experience?.year} yr(s)`
                            : "Fresher"}
                        </td>

                        {/* Resume */}
                        <td className="px-5 py-4">
                          {app?.user?.resume?.url ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(
                                  `https://docs.google.com/gview?url=${app?.user?.resume?.url}&embedded=true`,
                                  "_blank"
                                );
                              }}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              View CV
                              <ExternalLink className="w-3 h-3 text-indigo-400" />
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">None</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${statusColor[app?.status] || "bg-slate-100 text-slate-700 border-slate-200"}`}
                          >
                            {app?.status}
                          </span>
                        </td>

                        {/* Applied Date */}
                        <td className="px-5 py-4 text-xs text-slate-500">
                          {app?.createdAt
                            ? new Date(app.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}
                        </td>

                        {/* Schedule CTA */}
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => openScheduleModal(e, app)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100/80 transition-colors shadow-2xs cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                            Schedule
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

        {/* Schedule Interview Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
              onClick={() => setShowModal(false)}
            />

            <div className="relative z-50 w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xs">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Schedule Interview Round
                    </h2>
                    <p className="text-xs text-slate-500">
                      For {selectedCandidate?.user?.firstname} {selectedCandidate?.user?.lastname} (
                      {selectedCandidate?.job?.title})
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Interview Date <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={interviewData.date}
                        onChange={handleChange}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Interview Time <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        name="time"
                        value={interviewData.time}
                        onChange={handleChange}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Interview Mode Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Interview Mode <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setInterviewData({
                          ...interviewData,
                          mode: "Online",
                          location: "",
                        })
                      }
                      className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                        interviewData.mode === "Online"
                          ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-2xs"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      Online Meeting
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setInterviewData({
                          ...interviewData,
                          mode: "Offline",
                          meetLink: "",
                        })
                      }
                      className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                        interviewData.mode === "Offline"
                          ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-2xs"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                      In-Person (Office)
                    </button>
                  </div>
                </div>

                {/* Conditional Fields */}
                {interviewData.mode === "Online" ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Google Meet / Zoom URL <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Video className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="url"
                        name="meetLink"
                        placeholder="https://meet.google.com/abc-defg-hij"
                        value={interviewData.meetLink}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Interview Venue / Office Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        name="location"
                        placeholder="e.g. Conference Room 3B, Tech Park, Bangalore"
                        value={interviewData.location}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Instructions / Notes for Candidate{" "}
                    <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    name="notes"
                    rows="3"
                    placeholder="e.g. Please keep your portfolio handy and test your microphone beforehand."
                    value={interviewData.notes}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                  />
                </div>

                {/* Modal Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm shadow-indigo-500/25 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm & Schedule
                      </>
                    )}
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

export default Shortlisted;

