import React from "react";
import "./styles.css";
import "react-toastify/dist/ReactToastify.css";
import MainContent from "../Components/HomePage/HomePageMiddleContainer";
import RightSidebar from "../Components/HomePage/HomePageRightSidebar";
import Layout from "../Components/Layout";
// import HomePageRightSidebarMobileView from "../Components/HomePage/HomePageRightSidebarMobileView";

function HomePage() {
  return (
    <Layout>
      <MainContent />
      <RightSidebar />
    </Layout>
  );
}

export default HomePage;
