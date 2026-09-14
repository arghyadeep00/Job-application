import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import statusColor from "../../styles/statusColor";
import toast from "react-hot-toast";

const Shortlisted = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [jobId, setJobId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [applicationId, setApplicationId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchShortListed = async () => {
    try {
      const response = await api.get("/application/shortlisted-applicants");
      setApplications(response.data.resultData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchShortListed();
  }, []);

  // Interview form state
  const [interviewData, setInterviewData] = useState({
    date: "",
    time: "",
    mode: "",
    meetLink: "",
    location: "",
    notes: "",
  });

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setInterviewData({
      ...interviewData,
      [e.target.name]: e.target.value,
    });
  };

  const combineDateTime = (date, time) => {
    return new Date(`${date}T${time}`);
  };

  const handleSubmit = async () => {
    try {
      if (!interviewData.date || !interviewData.time || !interviewData.mode) {
        return toast.error("Please fill all required fields");
      }

      if (interviewData.mode === "Online" && !interviewData.meetLink) {
        return toast.error("Please enter Google Meet link");
      }

      if (interviewData.mode === "Offline" && !interviewData.location) {
        return toast.error("Please enter interview location");
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
      toast.success(response.data.message);
      setShowModal(false);

      // reset form
      setInterviewData({
        date: "",
        time: "",
        mode: "",
        meetLink: "",
        location: "",
        notes: "",
      });
    } catch (err) {
      console.log(err)
      toast.error(err.response.data.message || "interview schedule failed")
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Shortlisted Candidates
        </h1>
        <p className="text-sm text-gray-500">
          Candidates selected for further interview rounds
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        {applications.length === 0 ? (
          <p className="text-center p-4">No shortlisted applicant present</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-center text-gray-600">
                <th className="px-4 py-3">Job Title</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Domain</th>
                <th className="px-4 py-3">Resume</th>
                <th className="px-4 py-3">Experience</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Applied On</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((e, key) => (
                <tr
                  key={key}
                  className="text-center odd:bg-white even:bg-gray-50 hover:bg-blue-50 cursor-pointer"
                  onClick={() => navigate(`/admin/user-profile/${e.user._id}`)}
                >
                  <td className="px-4 py-3 text-blue-700 font-bold">
                    {e?.job?.title}
                  </td>
                  <td className="px-4 py-3">
                    {e?.user?.firstname} {e?.user?.middlename}{" "}
                    {e?.user?.lastname}
                  </td>
                  <td>{e?.user?.email}</td>
                  <td>{e?.user?.domain}</td>

                  {e?.user?.resume?.url ? (
                    <td
                      className="underline text-blue-600 cursor-pointer"
                      onClick={(event) => {
                        event.stopPropagation();
                        window.open(
                          `https://docs.google.com/gview?url=${e?.user?.resume?.url}&embedded=true`,
                          "_blank"
                        );
                      }}
                    >
                      View
                    </td>
                  ) : (
                    <td>-</td>
                  )}

                  <td>{e?.user?.experience?.year || 0} Year</td>

                  <td>
                    <span
                      className={`px-2 py-1 text-xs rounded ${statusColor[e?.status]}`}
                    >
                      {e?.status}
                    </span>
                  </td>

                  <td>
                    {new Date(e?.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td>
                    <button
                      className="text-green-600 hover:underline"
                      onClick={(event) => {
                        event.stopPropagation();
                        setShowModal(true);
                        setJobId(e?.job?._id);
                        setUserId(e?.user?._id);
                        setApplicationId(e?._id);
                      }}
                    >
                      Interview Date
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />

            <div className="relative z-50 w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-semibold mb-6">
                Schedule Interview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Date */}
                <input
                  type="date"
                  name="date"
                  value={interviewData.date}
                  onChange={handleChange}
                  className="border p-2.5 rounded-lg focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                />

                {/* Time */}
                <input
                  type="time"
                  name="time"
                  value={interviewData.time}
                  onChange={handleChange}
                  className="border p-2.5 rounded-lg focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                />

                {/* Mode */}
                <div className="md:col-span-2 flex gap-4">
                  {["Online", "Offline"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() =>
                        setInterviewData({
                          ...interviewData,
                          mode: m,
                          meetLink: "",
                          location: "",
                        })
                      }
                      className={`px-4 py-2 rounded-lg border ${interviewData.mode === m
                        ? "bg-blue-600 text-white"
                        : "border-gray-300"
                        }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {/* Conditional Field */}
                {interviewData.mode === "Online" && (
                  <input
                    type="url"
                    name="meetLink"
                    placeholder="Google Meet Link"
                    value={interviewData.meetLink}
                    onChange={handleChange}
                    className="md:col-span-2 border p-2.5 rounded-lg focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                  />
                )}

                {interviewData.mode === "Offline" && (
                  <input
                    type="text"
                    name="location"
                    placeholder="Interview Location"
                    value={interviewData.location}
                    onChange={handleChange}
                    className="md:col-span-2 border p-2.5 rounded-lg focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                  />
                )}

                {/* Notes */}
                <textarea
                  name="notes"
                  placeholder="Notes (optional)"
                  value={interviewData.notes}
                  onChange={handleChange}
                  className="md:col-span-2 border p-2.5 rounded-lg focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="border px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                  Save Interview
                  {
                    loading ? "Please wait..." : "Save Interview"
                  }
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Shortlisted;
