import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { reportPost } from "../../API/Post/post";
import Layout from "../Layout";
import useUserDetails from "../../Hooks/useUserDetails";
import { ToastContainer, toast } from "react-toastify";

const ReportPost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const userDetails = useUserDetails();
  const navigate = useNavigate();

  const [reportReason, setReportReason] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason) {
      toast.error("Please select a reason for reporting.");
      return;
    }
    try {
      const response = await reportPost({
        postId,
        reason: reportReason,
        comments: additionalComments,
        reporterId: userDetails?._id,
        reporterUsername: userDetails?.username,
      });
      if (response ) {
        toast.success("Report submitted successfully.");
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      }
    } catch (error) {
      console.error("Error reporting post:", error);
      toast.error("Failed to submit report.");
    }
  };

  return (
    <Layout>
      <ToastContainer />
      <main className="flex-1 pt-2 p-2 overflow-auto no-scrollbar bg-gray-800 dark:bg-gray-700 text-white">
        <div className="mx-auto h-full rounded-lg shadow-lg bg-slate-300 dark:bg-slate-800 overflow-auto no-scrollbar p-4">
          <h2 className="text-xl mb-4">Report Post</h2>
          <form onSubmit={handleReportSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-small text-gray-700 dark:text-gray-300">
                Reason for reporting
              </label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="mt-1 block w-4/5 rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                required
              >
                <option value="" disabled>
                  Select a reason
                </option>
                <option value="spam">Spam</option>
                <option value="harassment">Harassment</option>
                <option value="offensive">Offensive</option>
                <option value="inappropriate">Inappropriate Content</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Additional Comments
              </label>
              <textarea
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 sm:text-sm"
                rows={4}
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Submit Report
            </button>
          </form>
        </div>
      </main>
    </Layout>
  );
};

export default ReportPost;
