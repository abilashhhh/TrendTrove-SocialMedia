import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { StoreType } from "./Redux/Store/reduxStore";

const PublicRoute: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: StoreType) => state.userAuth.isAuthenticated
  );
  const isAdminAuthenticated = useSelector(
    (state: StoreType) => state.admin.isAuthenticated
  );

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  if (isAdminAuthenticated) {
    return <Navigate to="/admin/home" />;
  }

  return <Outlet />;
};

export default PublicRoute;
