import React from "react";
import ProtectedRoute from "../protected/ProtectedRoute";
import { UserGlobalProvider } from "../context/UserContext";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <ProtectedRoute role="user">
      <UserGlobalProvider>
        <Outlet />
      </UserGlobalProvider>
    </ProtectedRoute>
  );
};

export default UserLayout;
