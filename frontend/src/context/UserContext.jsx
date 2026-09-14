import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
const UserGlobalContext = createContext();

export const UserGlobalProvider = ({ children }) => {
  const [appliedJobs, setappliedJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchApplyJobs = async () => {
    setLoading(true);
    const response = await api.get("/job/fetch-applied-jobs");
    setappliedJobs(response.data.resultData);
    setLoading(false);
  };
  // fetch interview details
  const [interviewDetails, setInterviewDetails] = useState([]);
  const fetchInterviewDetails = async () => {
    try {
      const response = await api.get("/interview/interview-details");
      setInterviewDetails(response.data.resultData);
    } catch (error) {
      toast.error("interview details error")
    }
  }
  useEffect(() => {
    fetchInterviewDetails()
    fetchApplyJobs();
  }, []);
  return (
    <UserGlobalContext.Provider
      value={{ appliedJobs, interviewDetails, loading, setLoading, fetchApplyJobs }}
    >
      {children}
    </UserGlobalContext.Provider>
  );
};

export const useUserGlobal = () => useContext(UserGlobalContext);
