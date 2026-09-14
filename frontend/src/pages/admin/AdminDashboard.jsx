import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  FolderKanban,
  ArrowRight,
  TrendingUp,
  FileText,
  Calendar,
  Sparkles
} from "lucide-react";
import { useAdminGlobal } from "../../context/AdminContext";
import statusColor from "../../styles/statusColor";

const AdminDashboard = () => {
  const {
    recentApplications = [],
    totalApplications = 0,
    pending = 0,
    shortlisted = 0,
    rejected = 0,
  } = useAdminGlobal();

  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Recruitment Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Overview of hiring pipeline, candidate volume, and recent activities
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/job-management"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-sm transition"
            >
              Post New Job
            </Link>
            <Link
              to="/admin/applications"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 transition shadow-2xs"
            >
              Review Pipeline
            </Link>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Received</span>
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                <FolderKanban size={18} />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2">{totalApplications}</h3>
            <p className="text-xs text-slate-500 mt-1">Across all active postings</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Under Review</span>
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                <Clock size={18} />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2">{pending}</h3>
            <p className="text-xs text-slate-500 mt-1">Awaiting status decision</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shortlisted</span>
              <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2">{shortlisted}</h3>
            <p className="text-xs text-slate-500 mt-1">Ready for interview stage</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rejected</span>
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                <XCircle size={18} />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2">{rejected}</h3>
            <p className="text-xs text-slate-500 mt-1">Archive notifications sent</p>
          </div>
        </div>

        {/* Recent Applications Section */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Recent Applications (Last 5 Days)</h2>
              <p className="text-xs text-slate-500 mt-0.5">Click any candidate row to view their complete dossier</p>
            </div>

            <Link
              to="/admin/applications"
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              View Full List <ArrowRight size={13} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {recentApplications.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <FileText size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-slate-700">No applications received in the last 5 days</p>
                <p className="text-xs text-slate-400 mt-1">New candidate submissions will automatically appear here</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Candidate</th>
                    <th className="px-6 py-4">Applied Position</th>
                    <th className="px-6 py-4">Domain Track</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Submission Date</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {recentApplications.map((item) => {
                    const fullName = [item?.user?.firstname, item?.user?.middlename, item?.user?.lastname]
                      .filter(Boolean)
                      .join(" ") || "Candidate";
                    const initial = item?.user?.firstname?.charAt(0) || "C";

                    return (
                      <tr
                        key={item._id}
                        onClick={() => navigate(`/admin/user-profile/${item?.user?._id}`)}
                        className="hover:bg-purple-50/40 cursor-pointer transition"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0">
                              {initial}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-800">{fullName}</div>
                              <div className="text-xs text-slate-400">{item?.user?.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-bold text-purple-700 text-xs sm:text-sm">
                            {item?.job?.title || "Role Title"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                            {item?.user?.domain || "General"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 text-xs rounded-full ${statusColor[item?.status]}`}>
                            {item?.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-xs text-slate-500">
                          {new Date(item?.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 group-hover:text-purple-800">
                            Review <ArrowRight size={13} />
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
