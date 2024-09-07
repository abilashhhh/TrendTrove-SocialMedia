import "./styles.css";
import ProfileMainCenterComponent from "../Components/ProfilePage/ProfileMainCenterComponent";
import LoadingSpinner from "../Components/LoadingSpinner";
import Layout from "../Components/Layout";
import useUserDetails from "../Hooks/useUserDetails";

function ProfilePage() {
  const userDetails = useUserDetails();
  
  if (!userDetails.username) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Layout>
        <ProfileMainCenterComponent userDetails={userDetails} />
      </Layout>
    </>
  );
}

export default ProfilePage;
