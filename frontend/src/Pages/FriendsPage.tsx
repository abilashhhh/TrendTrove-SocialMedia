import "./styles.css";
import Layout from "../Components/Layout";
import FriendsMiddlePage from "../Components/Friends/FriendsMiddlePage";
import { ActiveSectionProvider } from "../Components/Friends/ActiveSectionContext";

function FriendsPage() {
  return (
    <>
      <Layout>
        <ActiveSectionProvider>
          <FriendsMiddlePage />
        </ActiveSectionProvider>
      </Layout>
    </>
  );
}

export default FriendsPage;
