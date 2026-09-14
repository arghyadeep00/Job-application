import { NavLink } from "react-router-dom";
import { House, IdCardLanyard } from "lucide-react";
import { BriefcaseBusiness } from "lucide-react";
import { FileUser } from "lucide-react";
import { UserPen } from "lucide-react";
import { LayoutGrid } from "lucide-react";
import { Layers2 } from "lucide-react";

import { useAuth } from "../context/AuthContext";
const Sidebar = () => {
  const { user } = useAuth();
  const menu = {
    admin: [
      { icon: <House />, name: "Home", path: "/admin/dashboard" },
      {
        icon: <LayoutGrid />,
        name: "Applications",
        path: "/admin/applications",
      },
      { icon: <Layers2 />, name: "Shortlisted", path: "/admin/shortlisted" },
      { icon: <IdCardLanyard />, name: "Employees", path: "/admin/employee" },

      {
        icon: <BriefcaseBusiness />,
        name: "Jobs Management",
        path: "/admin/job-management",
      },
      { icon: <UserPen />, name: "My Profile", path: "/admin/profile" },
    ],
    user: [
      { icon: <House />, name: "Home", path: "/user/dashboard" },
      {
        icon: <BriefcaseBusiness />,
        name: "Job Profiles",
        path: "/user/job-profile",
      },
      {
        icon: <FileUser />,
        name: "Applied Jobs",
        path: "/user/applied-jobs",
      },
      { icon: <UserPen />, name: "My Profile", path: "/user/profile" },
    ],
  };
  return (
    <aside className="w-64 h-full bg-white shadow-lg hidden md:block">
      <div className="p-6 text-xl font-bold text-blue-600">
        {user?.role == "user" ? "Applicant Panel" : "Admin Panel"}
      </div>

      <nav className="px-4 space-y-2">
        {menu[user?.role].map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg flex items-center gap-3 font-semibold ${
                isActive
                  ? "bg-purple-100 text-purple-600"
                  : "hover:bg-gray-100 text-gray-500"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
