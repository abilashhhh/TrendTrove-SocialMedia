import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { StoreType } from "./Redux/Store/reduxStore";

const PrivateRoute: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: StoreType) => state.userAuth.isAuthenticated
  );
  const isAdminAuthenticated = useSelector(
    (state: StoreType) => state.admin.isAuthenticated
  );

  if (isAuthenticated || isAdminAuthenticated) {
    return <Outlet />; // Render child routes
  }

  return <Navigate to="/" />;
};

export default PrivateRoute;
