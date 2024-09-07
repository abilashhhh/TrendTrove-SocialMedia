import React from "react";
import "./styles.css";
import "react-toastify/dist/ReactToastify.css";

import Layout from "../Components/Layout";
import NewsFeedsMainPage from "../Components/NewFeeds/NewsFeedsMainPage";

function NewsFeed() {
  return (
    <Layout>
      <NewsFeedsMainPage />
    </Layout>
  );
}

export default NewsFeed;
