import React from "react";
import "./styles.css";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../Components/Layout";
import SettingsMiddlePage from "../Components/Settings/SettingsMiddlePage";

function SettingsPage() {
  return (
    <Layout>
      <SettingsMiddlePage />
    </Layout>
  );
}

export default SettingsPage;
