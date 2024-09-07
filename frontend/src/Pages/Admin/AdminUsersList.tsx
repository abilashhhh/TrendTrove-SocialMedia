import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { adminLogout } from "../../Redux/AdminSlice/adminSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../Components/LoadingSpinner";
import AdminLeftSidebar from "../../Components/AdminPage/AdminLeftSidebar";
import AdminHeader from "../../Components/AdminPage/AdminHeader";
import { useNavigate } from "react-router-dom";
import AdminUsersListComponent from "../../Components/AdminPage/AdminUsersListComponent";
import { logoutAdmin } from "../../API/Admin/admin";

function AdminUsersList() {
  const navigate = useNavigate();
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [isDarkMode, setDarkMode] = useState(true);
  const dispatch = useDispatch();

  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode);
  };

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!isLeftSidebarOpen);
  };
 

  const handleLogout = async () => {
    const response = await logoutAdmin();
    if (response.status === "success") {
      toast.error("Logging Out");
      setTimeout(() => {
        dispatch(adminLogout());
      }, 3000);
    }
  };

  const handleUsersList = () => {
    navigate("/admin/userslist");
  };

  const handleUsersReports = () => {
    navigate("/admin/postReport");
  };

  const handlePremiumAccounts = () => {
    navigate("/admin/premiummanagement");
  };

  const handleHome = () => {
    navigate("/admin/home");
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <ToastContainer />
      <div className={`flex flex-col h-screen ${isDarkMode ? "dark" : ""}`}>
        <AdminHeader toggleLeftSidebar={toggleLeftSidebar} />
        <div className="flex flex-1 overflow-hidden">
          <AdminLeftSidebar
            isLeftSidebarOpen={isLeftSidebarOpen}
            toggleDarkMode={toggleDarkMode}
            isDarkMode={isDarkMode}
            handleLogout={handleLogout}
             handleUsersList={handleUsersList}
            handleUsersReports={handleUsersReports}
            handleHome={handleHome}
            handlePremiumAccounts={handlePremiumAccounts}
          />
          <AdminUsersListComponent />
        </div>
      </div>
    </>
  );
}

export default AdminUsersList;
