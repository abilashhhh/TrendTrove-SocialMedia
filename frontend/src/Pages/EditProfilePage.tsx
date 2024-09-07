import "./styles.css";
import LoadingSpinner from "../Components/LoadingSpinner";
import Layout from "../Components/Layout";
import useUserDetails from "../Hooks/useUserDetails";
import EditProfileMainCenterComponent from "../Components/ProfilePage/EditProfileMainCenterComponent";

function EditProfilePage() {
  const userDetails = useUserDetails();
  if (!userDetails.username) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Layout>
        <EditProfileMainCenterComponent userDetails={userDetails} />
      </Layout>
    </>
  );
}

export default EditProfilePage;
