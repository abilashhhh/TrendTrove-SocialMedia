import React, { lazy, Suspense } from "react";
import "./styles.css";
import LoadingSpinner from "../Components/LoadingSpinner";

const Layout = lazy(() => import("../Components/Layout"));
const ChatMiddlePage = lazy(() => import("../Components/Chat/ChatMiddlePage"));

function ChatPage() {
  return (
    <Suspense fallback={<div><LoadingSpinner/></div>}>
      <Layout>
        <ChatMiddlePage />
      </Layout>
    </Suspense>
  );
}

export default ChatPage;
