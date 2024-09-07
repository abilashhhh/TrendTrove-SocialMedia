import React, { useEffect, useState } from "react";
import { getStoriesForHighlights, gethighlightsdata, handleDeleteHighlight } from "../../API/Post/post";
import { formatDateTime } from "../../utils/timeAgo";
import { FaPen, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

const DisplayHighlight = () => {
  const [storyhighlights, setStoryhighlights] = useState([]);
  const [storyhighlights2, setStoryhighlights2] = useState([]);
  const [selectedHighlight, setSelectedHighlight] = useState(null);
  const [storyDetails, setStoryDetails] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [highlightToDelete, setHighlightToDelete] = useState(null);

  useEffect(() => {
    const getAllUserHighlights = async () => {
      const stories = await gethighlightsdata();
      if (stories.status === "success") {
        setStoryhighlights(stories?.data);
      }
    };
    getAllUserHighlights();
  }, []);

  useEffect(() => {
    const getAllStoriesOfUser = async () => {
      const stories = await getStoriesForHighlights();
      if (stories.status === "success") {
        setStoryhighlights2(stories?.data);
      }
    };
    getAllStoriesOfUser();
  }, []);

  const handleHighlightClick = async (highlight) => {
    setSelectedHighlight(highlight);
    const storyIds = highlight.selectedStories;
    const details = storyhighlights2.filter((story) =>
      storyIds.includes(story._id)
    );
    setStoryDetails(details);
    document.getElementById("editHighlight").showModal();
  };

  const deleteHighlight = async () => {
    try {
      document.getElementById("editHighlight")?.close();
      if (!highlightToDelete) return;
      console.log("deleteHighlight CALLED", highlightToDelete);
      const response = await handleDeleteHighlight(highlightToDelete);
      if (response.status === "success") {
        toast.success("Highlight deleted successfully");
        setStoryhighlights(storyhighlights.filter(h => h._id !== highlightToDelete));
        setShowConfirmDelete(false);
        setHighlightToDelete(null);
      }
    } catch (error) {
      toast.error(`Error deleting highlight: ${error.message}`);
    }
  };

  const confirmDeleteHighlight = (highlightId) => {
    document.getElementById("editHighlight")?.close();

    setHighlightToDelete(highlightId);
    setShowConfirmDelete(true);
  };

  const editHighlight = async (highlightId) => {
    console.log("editHighlight CALLED", highlightId);
    // Add edit logic here
  };

  return (
    <>
      <ToastContainer />
      <div>
        <dialog id="editHighlight" className="modal">
          <div className="modal-box w-full max-w-3xl text-black dark:text-gray-300 overflow-auto no-scrollbar bg-gray-200 dark:bg-gray-800">
            {selectedHighlight && (
              <div className="items-center">
                <div className="bg-gray-200 dark:bg-slate-800 p-2 items-center flex flex-col">
                  <h3 className="font-bold text-lg underline p-2">
                    {selectedHighlight.highlightName}{" "}
                    <button
                      onClick={() => editHighlight(selectedHighlight._id)}
                      className="absolute right-7 top-10"
                    >
                      <FaPen />
                    </button>
                    <button
                      onClick={() => confirmDeleteHighlight(selectedHighlight._id)}
                      className="absolute right-14 top-10"
                    >
                      <FaTrash />
                    </button>
                  </h3>
                  <div className="mb-4">
                    <img
                      className="rounded-full w-32 h-32"
                      src={selectedHighlight.coverImage}
                      alt="Selected Highlight"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Stories:</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                    {storyDetails.map((story, index) => (
                      <li
                        key={index}
                        className="bg-slate-200 dark:bg-slate-900 p-2 m-2 flex flex-col items-center rounded-lg shadow-lg"
                      >
                        <div className="w-full h-44 relative">
                          {story.mediaType === "video" ? (
                            <video
                              className="w-full h-full object-cover rounded-lg"
                              controls
                            >
                              <source src={story.mediaUrl} type="video/mp4" />
                            </video>
                          ) : (
                            <img
                              className="w-full h-full object-cover rounded-lg"
                              src={story.mediaUrl}
                              alt="Story Media"
                            />
                          )}
                        </div>
                        <div className="p-2 text-center">
                          <p className="font-semibold">{story.captions}</p>
                          <p className="text-xs text-gray-500">
                            {formatDateTime(story.createdAt)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>

      <div className="rounded-lg flex gap-2 overflow-y-auto no-scrollbar w-full h-full">
  {storyhighlights &&
    storyhighlights.map((story, index) => (
      <div
        key={index}
        className="flex flex-col items-center rounded-lg p-2 flex-shrink-0 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={() => handleHighlightClick(story)}
      >
        <div>
          <img
            className="rounded-full w-16 h-1w-16 sm:w-16 sm:h-1w-16 md:w-16 md:h-1w-16 lg:w-24 lg:h-24"
            src={story.coverImage}
            alt="Story Highlight"
          />
        </div>
        <div className="text-center text-sm mt-2 flex gap-2 items-center">
          {story.highlightName}
        </div>
      </div>
    ))}
</div>


      {showConfirmDelete && (
        <div className="fixed inset-0  flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm mx-auto">
            <p className="text-center mb-4 text-black dark:text-white">
              Are you sure you want to delete this highlight?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={deleteHighlight}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DisplayHighlight;
