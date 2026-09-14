import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useUserGlobal } from "../../context/UserContext";
import statusColor from "../../styles/statusColor";
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Video, 
  MapPin, 
  FileText, 
  ArrowUpRight, 
  Sparkles,
  ArrowRight,
  UserCheck
} from "lucide-react";

const UserDashboard = () => {
  const { appliedJobs, interviewDetails } = useUserGlobal();
  const navigate = useNavigate();

  const scheduledInterviews =
    interviewDetails?.filter((e) => ["Scheduled"].includes(e.status)) || [];

  const visibleApplications =
    appliedJobs?.filter((e) =>
      ["Pending", "Shortlisted", "Scheduled"].includes(e?.status)
    ) || [];

  const pendingCount = appliedJobs?.filter((e) => e?.status === "Pending").length || 0;
  const shortlistedCount = appliedJobs?.filter((e) => e?.status === "Shortlisted").length || 0;
  const totalApplied = appliedJobs?.length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header & Quick Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Candidate Overview
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Track your active applications and upcoming interview schedules
            </p>
          </div>

          <Link
            to="/user/job-profile"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-sm transition self-start sm:self-auto"
          >
            <Briefcase size={16} /> Explore Open Roles
          </Link>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Applied</span>
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                <Briefcase size={18} />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2">{totalApplied}</h3>
            <p className="text-xs text-slate-500 mt-1">Total applications submitted</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">In Review</span>
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                <Clock size={18} />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2">{pendingCount}</h3>
            <p className="text-xs text-slate-500 mt-1">Pending recruiter feedback</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shortlisted</span>
              <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2">{shortlistedCount}</h3>
            <p className="text-xs text-slate-500 mt-1">Passed initial review</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interviews</span>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <Calendar size={18} />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2">{scheduledInterviews.length}</h3>
            <p className="text-xs text-slate-500 mt-1">Active interview invites</p>
          </div>
        </div>

        {/* Profile Completion Callout */}
        <div className="bg-linear-to-r from-purple-50 via-indigo-50 to-purple-50/50 p-6 rounded-2xl border border-purple-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-600 text-white rounded-xl shadow-xs shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Increase Your Interview Selection Rate
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Complete all sections in your profile including verified education, skills, and updated resume.
              </p>
            </div>
          </div>

          <Link
            to="/user/profile"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-purple-700 font-semibold text-xs border border-purple-200 shadow-2xs transition shrink-0"
          >
            Update Profile <ArrowRight size={14} />
          </Link>
        </div>

        {/* Active Applications Section */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Active Applications</h2>
              <p className="text-xs text-slate-500 mt-0.5">Your submitted applications currently in process</p>
            </div>

            <Link
              to="/user/applied-jobs"
              className="text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Department & Role</th>
                  <th className="px-6 py-3.5">Company</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Applied Date</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {visibleApplications.length > 0 ? (
                  visibleApplications.map((e, key) => (
                    <tr className="hover:bg-slate-50/70 transition" key={key}>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">
                          {e?.job?.title || e?.job?.department || "Role"}
                        </div>
                        <div className="text-xs text-slate-400">
                          {e?.job?.department || "Technology"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">job-app</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 text-xs rounded-full ${statusColor[e?.status]}`}>
                          {e?.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(e?.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to="/user/applied-jobs"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-800"
                        >
                          Details <ArrowRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-slate-400 text-sm">
                      <Briefcase size={32} className="mx-auto text-slate-300 mb-2" />
                      <p className="font-medium text-slate-700">No active applications found</p>
                      <p className="text-xs text-slate-400 mt-1">Ready for your next opportunity? Browse open roles to apply.</p>
                      <Link
                        to="/user/job-profile"
                        className="inline-block mt-4 text-xs font-semibold px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
                      >
                        Explore Open Jobs
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Scheduled Interviews Section */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-800">Interview Schedule</h2>
            <p className="text-xs text-slate-500 mt-0.5">Upcoming interview rounds scheduled with hiring managers</p>
          </div>

          {scheduledInterviews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {scheduledInterviews.map((details, key) => (
                <div
                  key={key}
                  className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs hover:shadow-md transition space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                        Interview Confirmed
                      </span>
                      <h3 className="text-base font-bold text-slate-800 mt-2">
                        {details?.job?.title || "Technical Interview"}
                      </h3>
                      <p className="text-xs text-slate-400">job-app Hiring Team</p>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                      <Calendar size={20} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl text-xs">
                    <div>
                      <p className="text-slate-400 font-medium">Date</p>
                      <p className="font-semibold text-slate-700 mt-0.5">
                        {new Date(details?.interviewDate).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium">Time</p>
                      <p className="font-semibold text-slate-700 mt-0.5">
                        {new Date(details?.interviewDate).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Mode & Location/Link */}
                  <div className="space-y-2">
                    {details?.meetingLink && (
                      <a
                        href={details?.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-xs hover:bg-purple-700 shadow-xs transition"
                      >
                        <Video size={15} /> Join Google Meet Interview
                      </a>
                    )}

                    {details?.location && (
                      <div className="flex items-center gap-2 text-xs text-slate-600 p-2.5 bg-slate-50 rounded-xl">
                        <MapPin size={15} className="text-slate-400 shrink-0" />
                        <span className="truncate">{details.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-8 text-center">
              <Calendar size={36} className="mx-auto text-slate-300 mb-2" />
              <h3 className="text-base font-bold text-slate-700">No Interviews Scheduled</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Once an administrator reviews your application and schedules an interview slot, meeting links will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
