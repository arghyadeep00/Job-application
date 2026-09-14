import DashboardLayout from "../../layouts/DashboardLayout";
import {
  Users,
  CheckCircle,
  XCircle,
  LayoutGrid,
  Hourglass,
} from "lucide-react";
import { useAdminGlobal } from "../../context/AdminContext";
import { useEffect, useState } from "react";
import statusColor from "../../styles/statusColor";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  // global context
  const {
    recentApplications,
    totalApplications,
    pending,
    shortlisted,
    rejected,
  } = useAdminGlobal();

  const navigate = useNavigate();

  return (
    <DashboardLayout>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Overview of candidate applications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl shadow-sm bosm">
          <div className="flex items-center gap-3">
            <LayoutGrid className="text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Total Applications</p>
              <h2 className="text-xl font-semibold">{totalApplications}</h2>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <Hourglass className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <h2 className="text-xl font-semibold">{pending}</h2>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Shortlisted</p>
              <h2 className="text-xl font-semibold">{shortlisted}</h2>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <XCircle className="text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <h2 className="text-xl font-semibold">{rejected}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications Section */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-5">
        <h2 className="text-lg font-semibold mb-4">Recent Applications</h2>

        <div className="overflow-x-auto">
          {recentApplications.length == 0 ? (
            <p className="text-center roboto-flex">
              NO APPLICATION FOUND LAST 5 DAYS
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-gray-300">
                <tr className="text-left text-gray-700 ">
                  <th className="pb-3">Job Title</th>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Domin</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Apply Date</th>
                </tr>
              </thead>

              <tbody>
                {recentApplications.map((item) => (
                  <tr
                    className="hover:bg-blue-50 cursor-pointer odd:bg-white even:bg-gray-50"
                    key={item._id}
                    onClick={() =>
                      navigate(`/admin/user-profile/${item.user._id}`)
                    }
                  >
                    <td className="py-3 text-blue-700 font-bold">
                      {item?.job?.title}
                    </td>
                    <td className="py-3">{item?.user?.firstname} {item?.user?.middlename} {item?.user?.lastname}</td>
                    <td className="py-3">{item?.user?.email}</td>
                    <td>{item?.user?.domain}</td>
                    <td>
                      <span
                        className={`px-2 py-1 text-xs rounded ${statusColor[item?.status]}`}
                      >
                        {item?.status}
                      </span>
                    </td>
                    <td>
                      {new Date(item?.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
