import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
const ProtectedRoute = ({ children, role }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/" />;

  if (role && user.role !== role) return <Navigate to="/unauthorized" />;

  return children;
};

export default ProtectedRoute;
