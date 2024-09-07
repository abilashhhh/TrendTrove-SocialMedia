import React from "react";
import "./styles.css";
import "react-toastify/dist/ReactToastify.css";

import Layout from "../Components/Layout";
import ProfilePageIndividualComponent from "../Components/ProfilePage/ProfilePageIndividualComponent";

function ProfilePageIndividual() {
  return (
    <Layout>
      <ProfilePageIndividualComponent />
    </Layout>
  );
}

export default ProfilePageIndividual;
