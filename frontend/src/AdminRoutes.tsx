import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminHomePage from "./Pages/Admin/AdminHomePage";
// import AdminLoginPage from "./Pages/Admin/AdminLoginPage";
import PrivateRoute from "./PrivateRoute";
// import PublicRoute from "./PublicRoute";
import AdminUsersList from "./Pages/Admin/AdminUsersList";
import AdminReportManagement from "./Pages/Admin/AdminReportManagement";
import AdminPremiumManagement from "./Pages/Admin/AdminPremiumManagement";

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      
      {/* <Route element={<PublicRoute />}>
        <Route path="/signin" element={<AdminLoginPage />} />
      </Route> */}

      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<AdminHomePage />} />
        <Route path="/userslist" element={<AdminUsersList />} />
        <Route path="/postReport" element={<AdminReportManagement />} />
        <Route path="/premiummanagement" element={<AdminPremiumManagement />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
