import DashboardLayout from "../../layouts/DashboardLayout";
import { useUserGlobal } from "../../context/UserContext";

const UserDashboard = () => {

  const { appliedJobs, interviewDetails } = useUserGlobal();

  const scheduledInterviews =
    interviewDetails?.filter((e) => ["Scheduled"].includes(e.status)) || [];

  const visibleApplications =
    appliedJobs?.filter((e) =>
      ["Pending", "Shortlisted", "Scheduled"].includes(e?.status)
    ) || [];



  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Applications Table */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-6">My Applications</h2>

          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3">Role</th>
                <th className="p-3">Company</th>
                <th className="p-3">Status</th>
                <th className="p-3">Applied On</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {visibleApplications.length > 0 ? (
                visibleApplications.map((e, key) => (
                  <tr
                    className="hover:bg-gray-50 even:bg-gray-50 odd:bg-white"
                    key={key}
                  >
                    <td className="p-3">{e?.job?.department}</td>
                    <td className="p-3">job-app</td>
                    <td className="p-3 text-yellow-500 font-medium">{e?.status}</td>
                    <td className="p-3">
                      {new Date(e?.createdAt).toDateString()}
                    </td>
                    <td className="p-3">
                      <button className="text-blue-600 underline">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-10 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-lg font-semibold text-gray-700">
                        No Applications Yet
                      </p>
                      <p className="text-xl text-yellow-500">
                        Please complete your profile otherwise you will be rejected !
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>


        {scheduledInterviews.length > 0 ? (
          scheduledInterviews.map((details, key) => (
            <div className="grid md:grid-cols-2 gap-6" key={key}>

              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="font-semibold mb-4 text-gray-700">
                  Interview Details
                </h2>

                <div className="space-y-2 text-sm">
                  <p>
                    <strong className="text-gray-700">Date:</strong>{" "}
                    {new Date(details?.interviewDate).toLocaleDateString("en-IN")}
                  </p>
                  <p>
                    <strong className="text-gray-700">Time:</strong>{" "}
                    {new Date(details?.interviewDate).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>

                  {details?.meetingLink && (
                    <a
                      href={details?.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline cursor-pointer"
                    >
                      Join Google Meet
                    </a>
                  )}
                  {
                    details?.location && (
                      <p>
                        <strong className="text-gray-700">Location: </strong>{" "}
                        {details.location}
                      </p>
                    )
                  }
                </div>
              </div>

              {/* Application Info Card */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="font-semibold mb-4 text-gray-700">
                  Application Info
                </h2>

                <div className="space-y-2 text-sm">
                  <p><strong className="text-gray-700">Role:</strong> {details?.job?.title}</p>
                  <p><strong className="text-gray-700">Status:</strong> {details?.status}</p>
                  <p>
                    <strong className="text-gray-700">Resume:</strong>{" "}
                    <span
                      className="text-blue-600 underline cursor-pointer"
                      onClick={() =>
                        window.open(
                          `https://docs.google.com/gview?url=${details?.applicant?.resume?.url}&embedded=true`,
                          "_blank"
                        )
                      }
                    >
                      View
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Interview Scheduled Yet
            </h2>
            <p className="text-gray-500 text-sm">
              Once the admin schedules an interview, the details will appear here.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
