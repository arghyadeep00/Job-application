import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminLogin from "./pages/admin/AdminLogin";
import UserDashboard from "./pages/user/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Shortlisted from "./pages/admin/Shortlisted";
import HiredEmployee from './pages/admin/HiredEmployee'
import JobManagement from "./pages/admin/JobManagement";

import Profile from "./pages/user/Profile";
import LandingPage from "./pages/home/LandingPage";
import JobProfile from "./pages/user/JobProfile";
import AppliedJobs from "./pages/user/AppliedJobs";

import PageNotFound from "./components/pageNotFound";
import Unauthorized from "./components/Unauthorized";
import Applications from "./pages/admin/Applications";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import UserDetails from "./pages/admin/UserProfile";
import UserProfile from "./pages/admin/UserProfile";
import AdminProfile from "./pages/admin/AdminProfile";
import ForgotPassword from "./components/ForgotPassword";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/applicant-register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* protected pages for applicant */}

        <Route path="user" element={<UserLayout />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="job-profile" element={<JobProfile />} />
          <Route path="applied-jobs" element={<AppliedJobs />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* protected pages for admin */}
        <Route path="admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="applications" element={<Applications />} />
          <Route path="shortlisted" element={<Shortlisted />} />
          <Route path="employee" element={<HiredEmployee />} />
          <Route path="job-management" element={<JobManagement />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="user-profile/:id" element={<UserDetails />} />
        </Route>
        {/* 404 page */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

export default App;
