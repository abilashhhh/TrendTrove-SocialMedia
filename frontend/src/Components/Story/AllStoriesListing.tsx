import React, { useEffect, useState } from 'react'
import { getStoriesForHighlights } from '../../API/Post/post';
import { formatDateTime } from '../../utils/timeAgo';

const AllStoriesListing = () => {
    const [storyhighlights, setStoryhighlights] = useState([]);

    useEffect(() => {
      const getAllStoriesOfUser = async () => {
        const stories = await getStoriesForHighlights();
        console.log("Stories of user :stories.data:  ", stories.data);
        if (stories.status === "success") {
          setStoryhighlights(stories?.data);
        }
      };
      getAllStoriesOfUser();
    }, []);

  return (
    <div>
        
      <h1 className="font-semibold underline text-2xl p-2 ">MY STORIES <span className='text-sm no-underline'></span></h1>
      <div className="rounded-lg bg-gray-100 dark:bg-gray-900 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-1 text-black dark:text-white h-full overflow-y-auto no-scrollbar justify-center">
        {storyhighlights &&
          storyhighlights.map((story, index) => (
            <div key={index} className="p-2">
              {story.mediaType === "video" ? (
                <video
                  className="w-full h-80 object-cover rounded-none rounded-tr-lg rounded-tl-lg"
                  controls>
                  <source src={story.mediaUrl} type="video/mp4" />
                </video>
              ) : (
                <img
                  className="w-full h-80 object-cover rounded-none rounded-tr-lg rounded-tl-lg"
                  src={story.mediaUrl}
                  alt="Story Highlight"
                />
              )}

              <div>
                <button
                  className="btn rounded-none rounded-br-lg rounded-bl-lg w-full text-black dark:text-gray-300 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 hover:dark:bg-gray-700"
                  onClick={() =>
                    document.getElementById(`modal_${index}`).showModal()
                  }>
                  Info
                </button>
                <dialog id={`modal_${index}`} className="modal">
                  <div className="modal-box w-full max-w-3xl text-black dark:text-gray-300 bg-gray-200 dark:bg-gray-800">
                    <h3 className="font-bold text-lg underline my-2">
                      Stories
                    </h3>

                    <form method="dialog">
                      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                      </button>
                    </form>
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="flex-shrink-0">
                        {story.mediaType === "video" ? (
                          <video
                            className="w-52 h-80 object-cover rounded-none rounded-tr-lg rounded-tl-lg"
                            controls>
                            <source src={story.mediaUrl} type="video/mp4" />
                          </video>
                        ) : (
                          <img
                            className="w-full h-80 object-cover rounded-none rounded-tr-lg rounded-tl-lg"
                            src={story.mediaUrl}
                            alt="Story Highlight"
                          />
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="py-1 break-all">
                          Caption: {story.captions || "N/A"}
                        </p>
                        {/* <p className="py-1">
                          Added to highlights:{" "}
                          {story.isHighlighted ? "Yes" : "No"}
                        </p>
                          <p className="py-1">
                            Viewers: {story.viewers.length || "N/A"}
                          </p>
                          <p className="py-1">
                            View Count: {story.viewCount || "N/A"}
                          </p>
                          <p className="py-1">
                            Hidden From: {story.hiddenFrom.length || "N/A"}
                          </p>
                          <p className="py-1">
                            Reactions: {story.reactions.length || "N/A"}
                          </p> */}
                        <p className="py-1">
                          Posted At: {formatDateTime(story.createdAt) || "N/A"}
                        </p>

                        <p className="py-1">
                          Is Expired: {story.isExpired ? "Yes" : "No"}
                        </p>
                      </div>
                      
                    </div>
                  </div>
                  <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                  </form>
                </dialog>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default AllStoriesListing