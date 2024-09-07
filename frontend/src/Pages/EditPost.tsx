import "./styles.css";
import LoadingSpinner from "../Components/LoadingSpinner";
import Layout from "../Components/Layout";
import useUserDetails from "../Hooks/useUserDetails";
import EditPostMiddlePage from "../Components/Post/EditPostMiddlePage";

function EditPost() {
  const userDetails = useUserDetails();
  if (!userDetails.username) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Layout>
        <EditPostMiddlePage userDetails={userDetails} />
      </Layout>
    </>
  );
}

export default EditPost;
