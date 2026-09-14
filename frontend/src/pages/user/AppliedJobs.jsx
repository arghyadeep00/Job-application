import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useUserGlobal } from "../../context/UserContext";
import statusColor from "../../styles/statusColor";
import { 
  FileText, 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Briefcase 
} from "lucide-react";

const AppliedJobs = () => {
  const { appliedJobs } = useUserGlobal();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filterTabs = [
    { label: "All Applications", value: "all" },
    { label: "Pending", value: "Pending" },
    { label: "Shortlisted", value: "Shortlisted" },
    { label: "Scheduled", value: "Scheduled" },
    { label: "Rejected", value: "Rejected" },
  ];

  const filteredJobs = (appliedJobs || []).filter((item) => {
    const matchesTab = activeTab === "all" || item?.status === activeTab;
    const matchesSearch =
      item?.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.job?.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.job?.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Title & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Applied Positions
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Review and monitor the status of all your submitted job applications
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition"
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {filterTabs.map((tab) => {
            const count = tab.value === "all" 
              ? (appliedJobs || []).length 
              : (appliedJobs || []).filter((j) => j.status === tab.value).length;

            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition ${
                  activeTab === tab.value
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.value ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Job Role</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Type & Location</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4">Closing Date</th>
                  <th className="px-6 py-4">Application Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((jobs) => (
                    <tr key={jobs._id} className="hover:bg-slate-50/70 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">
                          {jobs?.job?.title || "Role Title"}
                        </div>
                        <div className="text-xs text-slate-400">job-app</div>
                      </td>

                      <td className="px-6 py-4 text-slate-600 font-medium text-xs">
                        {jobs?.job?.department || "General Engineering"}
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-500">
                        <div>{jobs?.job?.jobType || "Full-time"}</div>
                        <div className="text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={12} /> {jobs?.job?.location || "Remote"}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-600">
                        {new Date(jobs?.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-400">
                        {jobs?.job?.closingDate ? (
                          new Date(jobs?.job?.closingDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })
                        ) : (
                          "Open"
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 text-xs rounded-full ${statusColor[jobs.status]}`}>
                          {jobs.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          to="/user/job-profile"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-800"
                        >
                          View Job <ArrowRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-slate-400 text-sm">
                      <FileText size={36} className="mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold text-slate-700">No applications found</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {searchTerm ? "Try searching for a different keyword" : "You haven’t submitted any applications under this status yet."}
                      </p>
                      <Link
                        to="/user/job-profile"
                        className="inline-block mt-4 text-xs font-semibold px-4 py-2 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition"
                      >
                        Explore Open Positions
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AppliedJobs;
