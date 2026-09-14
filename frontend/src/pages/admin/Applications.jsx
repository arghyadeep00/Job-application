import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useRef, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import statusColor from "../../styles/statusColor";
import { useNavigate } from "react-router-dom";
import domain from "../../utils/domain";

const Applications = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [shortlistLoading, setShortlistLoading] = useState(false);

  const [applications, setApplications] = useState([]);
  const [editStatus, setEditStatus] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState([]);

  // filter states
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [userDomain, setUserDomain] = useState("");
  const filterOnClick = async () => {
    try {
      const response = await api.get("/application/search-application", {
        params: {
          search,
          status,
          domain: userDomain,
        },
      });
      setApplications(response.data.resultData);
    } catch (error) {
      console.log(error);
      toast.error("can't find");
    }
  };

  // one application set a variable for update
  const userStatusUpdate = (id) => {
    setEditStatus(true);
    setSelectedApplication(applications.find((e) => e._id === id));
  };

  // change status
  const updateStatus = async (status, applicationId, email, firstname, jobId) => {
    try {
      setLoading(true);
      if (status === "Shortlisted") {
        setShortlistLoading(true);
      }
      if (status === "Rejected") {
        setRejectLoading(true);
      }
      const response = await api.patch("/application/update-status", {
        status,
        applicationId,
        email,
        firstname,
        jobId
      });

      toast.success(response.data.message);
      fetchApplications();
    } catch (error) {
      toast.error("Status update filed");
    } finally {
      setLoading(false)
      setShortlistLoading(false);
      setRejectLoading(false);
      setEditStatus(false);
    }
  };

  // pagination code
  const [totalPages, setTotalPages] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);

  const fetchApplications = async () => {
    const res = await api.get(
      `/application/applications?page=${currentPage}&limit=${limit}`,
    );
    setApplications(res.data.applications);
    setTotalPages(res.data.totalPages);
  };
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    fetchApplications();
    hasFetched.current = true;
  }, [currentPage]);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // reset search data
  const resetBtn = () => {
    setSearch("");
    setStatus("");
    setUserDomain("");
    fetchApplications();
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Applications</h1>
        <p className="text-sm text-gray-500">
          Manage and review all candidate applications
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm  mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
        />

        <select
          className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
          }}
        >
          <option disabled value="">
            Status
          </option>
          <option value="Pending">Pending</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-200 focus:ring-purple-500 focus:border-purple-500"
          value={userDomain}
          onChange={(e) => {
            setUserDomain(e.target.value);
          }}
        >
          <option value="" disabled>
            Job Role
          </option>
          {domain.map((item, key) => (
            <option value={item?.value} key={key}>
              {item?.title}
            </option>
          ))}
        </select>

        <button
          className="bg-purple-600 font-semibold text-white px-5 py-2 rounded-lg text-sm hover:bg-purple-700"
          onClick={filterOnClick}
        >
          Filter
        </button>
        <button
          className="bg-gray-500 font-semibold text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-600"
          onClick={resetBtn}
        >
          Reset
        </button>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-sm  overflow-x-auto">
        {applications.length == 0 ? (
          <div className="text-center p-4">No applicant present</div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead className=" bg-gray-50">
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
              {applications.map((e) => (
                <tr
                  key={e._id}
                  className="text-center odd:bg-white cursor-pointer even:bg-gray-50 hover:bg-blue-50"
                  onClick={() => navigate(`/admin/user-profile/${e.user._id}`)}
                >
                  <td className="px-4 py-3 text-blue-700 font-bold">
                    {e?.job?.title}
                  </td>
                  <td className="px-4 py-3">{e?.user?.firstname} {e?.user?.middlename} {e?.user?.lastname}</td>
                  <td>{e?.user?.email}</td>
                  <td>{e?.user?.domain}</td>
                  {e?.user?.resume?.url ? (
                    <td
                      className="underline text-blue-600 cursor-pointer"
                      onClick={(event) => {
                        event.stopPropagation();
                        window.open(
                          `https://docs.google.com/gview?url=${e?.user?.resume?.url}&embedded=true`,
                          "_blank",
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
                  <td className="space-x-2">
                    <button
                      className="text-green-600 hover:underline"
                      onClick={(event) => {
                        event.stopPropagation();
                        userStatusUpdate(e._id);
                      }}
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg text-sm border disabled:opacity-50"
        >
          Previous
        </button>

        {/* Page Numbers */}

        <button
          className={"px-4 py-2 rounded-lg text-sm bg-blue-600 text-white"}
        >
          {currentPage}
        </button>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg text-sm border disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* update status */}
      {editStatus && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setEditStatus(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Update Application Status
            </h2>

            {/* USER DETAILS */}
            <div className="mb-4 shadow-md rounded p-3">
              <p className="text-sm font-semibold text-gray-600 mb-1">
                Candidate Details
              </p>
              <p className="text-sm">
                <span className="font-medium">Name:</span>{" "}
                {selectedApplication?.user?.firstname}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span>{" "}
                {selectedApplication?.user?.email}
              </p>
            </div>

            {/* JOB DETAILS */}
            <div className="mb-4 shadow-md rounded p-3">
              <p className="text-sm font-semibold text-gray-600 mb-1">
                Job Details
              </p>
              <p className="text-sm">
                <span className="font-medium">Title:</span>{" "}
                {selectedApplication?.job?.title}
              </p>
              <p className="text-sm">
                <span className="font-medium">Department:</span>{" "}
                {selectedApplication?.job?.department}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-between gap-3 mt-6">
              <button
                onClick={() =>
                  updateStatus("Rejected",
                    selectedApplication._id,
                    selectedApplication?.user?.email,
                    selectedApplication?.user?.firstname,
                    selectedApplication?.job?._id
                  )
                }
                disabled={loading}
                className="flex-1 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600"
              >
                {
                  rejectLoading ? 'Please Wait...' : 'Reject'
                }
              </button>
              <button
                onClick={() =>
                  updateStatus(
                    "Shortlisted",
                    selectedApplication._id,
                    selectedApplication.user.email,
                    selectedApplication.user.firstname,
                    selectedApplication?.job?._id
                  )
                }
                className="flex-1 py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600"
                disabled={loading}
              >
                {
                  shortlistLoading ? 'Please Wait...' : 'Shortlist'
                }
              </button>
            </div>

            <button
              onClick={() => setEditStatus(false)}
              className="w-full mt-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Applications;
