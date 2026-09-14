import { useState } from "react";
import { useAdminGlobal } from "../../context/AdminContext";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import toast from "react-hot-toast";

const AdminProfile = () => {
  const { adminDetails } = useAdminGlobal();
  const [updatePassword, setUpdatePassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
  })
  const handleOnChange = async (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev, [name]: value
    }))
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await api.post("/admin/password-change", {
        data
      })
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message || "Password change error")
    } finally {
      setLoading(false);
      setData({})
      setUpdatePassword(false)
    }
  }


  return (
    <DashboardLayout>
      <div className="p-6 max-w-8xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Profile</h1>

        {/* Profile Card */}
        <div className="bg-white shadow rounded-lg p-6 flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
            {adminDetails?.name?.charAt(0)}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {adminDetails.name}
            </h2>
            <p className="text-gray-500">{adminDetails.role}</p>
            <p className="text-sm text-gray-400">
              Joined on {new Date(adminDetails.createdAt).toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>

            <div className="space-y-3 text-sm">
              <p>
                <span className="font-medium text-gray-600">Email:</span>{" "}
                {adminDetails?.email}
              </p>
              <p>
                <span className="font-medium text-gray-600">Phone:</span>{" "}
                {adminDetails?.phone}
              </p>

            </div>
          </div>

          {/* Permissions / Role */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Admin Permissions</h3>

            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
              <li>Post & manage jobs</li>
              <li>View applicants</li>
              <li>Approve / reject applications</li>
              <li>Manage users</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button className="px-5 py-2 border bg-purple-500 text-white border-gray-300 rounded hover:bg-purple-700"
            onClick={() => setUpdatePassword(true)}
          >
            Change Password
          </button>
        </div>
      </div>

      {updatePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setUpdatePassword(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xl p-6">
            <h2 className="text-lg font-semibold mb-6 text-gray-700">
              Update Password
            </h2>
            <form className="flex flex-col gap-10 w-full" onSubmit={handlePasswordChange} >
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">Enter Old Password</label>
                <input
                  type="text"
                  name="oldPassword"
                  required
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter Old password"
                  onChange={handleOnChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">Enter New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  required
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter New Password"
                  onChange={handleOnChange}
                />
              </div>
              <div className="w-full"><button disabled={loading} className="w-full p-3 text-xl bg-purple-500 text-white rounded-xl hover:bg-purple-600" type="submit">{loading ? "Please wait" : "submit"}</button></div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default AdminProfile;
