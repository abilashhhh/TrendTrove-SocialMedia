import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import LoadingSpinner from "./Components/LoadingSpinner";
import NotificationToasts from "./Components/Notifications/NotificationToasts";
 

const HomePage = lazy(() => import("./Pages/HomePage"));
const SignUpPage = lazy(() => import("./Pages/SignUpPage"));
const SignInPage = lazy(() => import("./Pages/SignInPage"));
const ProfilePage = lazy(() => import("./Pages/ProfilePage"));
const OTPPage = lazy(() => import("./Pages/OTPPage"));
const BasePage = lazy(() => import("./Pages/BasePage"));
const ErrorPage = lazy(() => import("./Pages/ErrorPage"));
const EditProfilePage = lazy(() => import("./Pages/EditProfilePage"));
const SettingsPage = lazy(() => import("./Pages/SettingsPage"));
const FriendsPage = lazy(() => import("./Pages/FriendsPage"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const Addpost = lazy(() => import("./Pages/Addpost"));
const ProfilePageIndividual = lazy(() => import("./Pages/ProfilePageIndividual"));
const ReportPost = lazy(() => import("./Components/Post/ReportPost"));
const EditPost = lazy(() => import("./Pages/EditPost"));
const CommentsPage = lazy(() => import("./Components/Comments/CommentsPage"));
const ExplorePageComponent = lazy(() => import("./Components/Explore/ExplorePageComponent"));
const ChatPage = lazy(() => import("./Pages/ChatPage"));
const NotificationsPage = lazy(() => import("./Pages/NotificationsPage"));
const NewsFeed = lazy(() => import("./Pages/NewsFeed"));

const UserRoutes: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div>
          <LoadingSpinner />
        </div>
      }
    >
      <NotificationToasts />
      <Routes>
        <Route path="/" element={<BasePage />} />

        <Route element={<PublicRoute />}>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/otp" element={<OTPPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/editprofile" element={<EditProfilePage />} />
          <Route path="/profiles/:username" element={<ProfilePageIndividual />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/explore" element={<ExplorePageComponent />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/addpost" element={<Addpost />} />
          <Route path="/chats" element={<ChatPage />} />
          <Route path="/feeds" element={<NewsFeed />} />
          <Route path="/editpost/:postId" element={<EditPost />} />
          <Route path="/reportpost/:postId" element={<ReportPost />} />
          <Route path="/post/:postId" element={<CommentsPage />} />
        </Route>

        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Suspense>
  );
};

export default UserRoutes;
