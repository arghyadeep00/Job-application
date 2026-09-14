import { Outlet } from "react-router-dom";
import ProtectedRoute from "../protected/ProtectedRoute";
import { AdminGlobalProvider } from "../context/AdminContext";

const AdminLayout = () => {
  return (
    <ProtectedRoute role="admin">
      <AdminGlobalProvider>
        <Outlet />
      </AdminGlobalProvider>
    </ProtectedRoute>
  );
};

export default AdminLayout;
