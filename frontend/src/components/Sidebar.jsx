import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  User, 
  CheckCircle2, 
  Users, 
  FolderKanban,
  Sparkles
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  const menu = {
    admin: [
      { icon: <LayoutDashboard size={20} />, name: "Overview", path: "/admin/dashboard" },
      { icon: <FolderKanban size={20} />, name: "Applications", path: "/admin/applications" },
      { icon: <CheckCircle2 size={20} />, name: "Shortlisted", path: "/admin/shortlisted" },
      { icon: <Users size={20} />, name: "Employees", path: "/admin/employee" },
      { icon: <Briefcase size={20} />, name: "Job Management", path: "/admin/job-management" },
      { icon: <User size={20} />, name: "Admin Profile", path: "/admin/profile" },
    ],
    user: [
      { icon: <LayoutDashboard size={20} />, name: "Dashboard", path: "/user/dashboard" },
      { icon: <Briefcase size={20} />, name: "Explore Jobs", path: "/user/job-profile" },
      { icon: <FileText size={20} />, name: "Applied Jobs", path: "/user/applied-jobs" },
      { icon: <User size={20} />, name: "My Profile", path: "/user/profile" },
    ],
  };

  const userRole = user?.role || "user";
  const items = menu[userRole] || [];

  return (
    <aside className="w-64 h-full bg-white border-r border-slate-100 flex flex-col justify-between select-none">
      <div>
        {/* Panel Section Header */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {userRole === "admin" ? "Management Suite" : "Candidate Portal"}
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-800 mt-1">
            {userRole === "admin" ? "Admin Workspace" : "Applicant Space"}
          </h2>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {items.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-purple-50 text-purple-700 shadow-2xs font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`transition-colors ${isActive ? "text-purple-600" : "text-slate-400 group-hover:text-slate-600"}`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Quick Tips / Workspace Footer */}
      <div className="p-4 m-3 rounded-2xl bg-linear-to-br from-purple-50/80 to-indigo-50/50 border border-purple-100/70">
        <div className="flex items-center gap-2 text-purple-700 font-semibold text-xs mb-1">
          <Sparkles size={14} /> Need Help?
        </div>
        <p className="text-slate-500 text-[11px] leading-relaxed">
          {userRole === "admin" 
            ? "Manage candidate pipelines and job offers with ease." 
            : "Keep your profile 100% complete to increase your selection chances."}
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
