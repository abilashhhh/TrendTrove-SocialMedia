import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { getNewFeeds } from "../../API/Post/post";
import "react-toastify/dist/ReactToastify.css"; 
import LoadingSpinner from "../LoadingSpinner";  

interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  enclosure?: {
    url: string;
  };
}

const NewsFeedsMainPage: React.FC = () => {
  const [feeds, setFeeds] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getAllFeeds = async () => {
      try {
        const gettingFeeds = await getNewFeeds();
        if (gettingFeeds.status === "success") {
          const shuffledFeeds = gettingFeeds.data.sort(() => 0.5 - Math.random());
          setFeeds(shuffledFeeds);
        }
      } catch (error) {
        console.error("Failed to fetch feeds", error);
      } finally {
        setLoading(false);
      }
    };

    getAllFeeds();
  }, []);

  return (
    <>
      <ToastContainer />
      <main className="flex-1 p-2 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900 h-full">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full w-full overflow-auto no-scrollbar">
              {feeds && feeds.length > 0 ? (
                feeds.map((feed, index) => (
                  <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold">{feed.title}</h2>
                    <p className="text-sm mb-2">{new Date(feed.pubDate).toLocaleString()}</p>
                    {feed.enclosure?.url && (
                      <img src={feed.enclosure.url} alt={feed.title} className="mb-2 w-full h-auto object-cover rounded" />
                    )}
                    <p>{feed.content}</p>
                    <a href={feed.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 mt-2 block">
                      Read more
                    </a>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center">No feeds available.</p>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default NewsFeedsMainPage;
