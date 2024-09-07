import "./styles.css";
import LoadingSpinner from "../Components/LoadingSpinner";
import Layout from "../Components/Layout";
import useUserDetails from "../Hooks/useUserDetails";
import AddPostMiddlePage from "../Components/Post/AddPostMiddlePage";

function AddPost() {
  const userDetails = useUserDetails();
  if (!userDetails.username) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Layout>
        <AddPostMiddlePage userDetails={userDetails} />
      </Layout>
    </>
  );
}

export default AddPost;
