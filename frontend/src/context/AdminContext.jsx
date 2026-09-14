import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const AdminGlobalContext = createContext();

export const AdminGlobalProvider = ({ children }) => {
  const [adminDetails, setAdminDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);

  const [totalApplications, setTotalApplications] = useState(0);
  const [pending, setPending] = useState(0);
  const [shortlisted, setShortlisted] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [recentApplications, setRecentApplications] = useState([]);

  //
  const fetchAdminDetails = async () => {
    try {
      const response = await api.get("/admin/profile");

      setAdminDetails(response.data.resultData);
    } catch (error) {
      toast.error(error.response.message || "fetch admin details filed");
    }
  };
  // fetch all jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/job/all-jobs");
      setJobs(response.data.resultData);
    } catch (error) {
      toast.error("Fetching job error");
    } finally {
      setLoading(false);
    }
  };

  // fetch applicants
  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const response = await api.get("/application/all-applicants");
      setApplicants(response.data.resultData);
    } catch (error) {
      toast.error("Fetching applicants error");
    } finally {
      setLoading(false);
    }
  };

  // for admin page
  const fetchRecentApplications = async () => {
    try {
      const response = await api.get("/application/recent-applications");
      setRecentApplications(response.data.resultData);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchTotalApplications = async () => {
    try {
      const response = await api.get("/application/total-applications");
      setTotalApplications(response.data.resultData);
    } catch (error) { }
  };
  const fetchPending = async () => {
    try {
      const response = await api.get("/application/pending");
      setPending(response.data.resultData);
    } catch (error) { }
  };
  const fetchShortlisted = async () => {
    try {
      const response = await api.get("/application/shortlisted");
      setShortlisted(response.data.resultData);
    } catch (error) { }
  };
  const fetchRejected = async () => {
    try {
      const response = await api.get("/application/rejected");
      setRejected(response.data.resultData);
    } catch (error) { }
  };



  useEffect(() => {
    fetchAdminDetails();
    fetchJobs();
    fetchApplicants();
    fetchRecentApplications();
    fetchTotalApplications();
    fetchPending();
    fetchShortlisted();
    fetchRejected();
  }, []);

  return (
    <AdminGlobalContext.Provider
      value={{
        jobs,
        adminDetails,
        setJobs,
        applicants,
        setApplicants,
        fetchJobs,
        fetchApplicants,
        loading,
        totalApplications,
        pending,
        shortlisted,
        rejected,
        recentApplications,
      }}
    >
      {children}
    </AdminGlobalContext.Provider>
  );
};

export const useAdminGlobal = () => useContext(AdminGlobalContext);
