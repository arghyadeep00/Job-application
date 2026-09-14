import DashboardLayout from "../../layouts/DashboardLayout";
import { useUserGlobal } from "../../context/UserContext";
import statusColor from "../../styles/statusColor";

const AppliedJobs = () => {
  const { appliedJobs } = useUserGlobal();

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Applied Jobs</h1>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg overflow-hidden shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-[15px] text-gray-900 border-b border-gray-300 robot">
              <tr>
                <th className="text-left p-4">Job Title</th>
                <th className="text-left p-4">Job Type</th>
                <th className="text-left p-4">Location</th>

                <th className="text-left p-4">Applied On</th>
                <th className="text-left p-4">Closing Date</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {appliedJobs.map((jobs) => (
                <tr
                  key={jobs._id}
                  className="border-b border-gray-300 text-[16px] text-gray-700 last:border-0 roboto-flex"
                >
                  <td className="p-4 font-medium">{jobs?.job?.title}</td>
                  <td className="p-4 font-medium">{jobs?.job?.jobType}</td>
                  <td className="p-4 font-medium">{jobs?.job?.location}</td>
                  <td className="p-4">
                    {new Date(jobs?.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="p-4">
                    {new Date(jobs?.job?.closingDate).toLocaleDateString(
                      "en-IN",
                    )}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${statusColor[jobs.status]}`}
                    >
                      {jobs.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-blue-600 hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State (optional) */}
          {appliedJobs.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              You haven’t applied to any jobs yet.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AppliedJobs;
