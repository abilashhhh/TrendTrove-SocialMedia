import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { getAllPublicPostsForExplore } from "../../API/Post/post";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const MediaItem = ({ type, src }) => {
  if (type === "image") {
    return <img src={src} alt="Media" className="w-full h-full object-cover" />;
  } else if (type === "video") {
    return (
      <video
        autoPlay
        loop
        controls
        muted
        className="w-full h-full object-cover">
        <source src={src} type="video/mp4" />
      </video>
    );
  }
  return null;
};

const getRandomSpan = () => {
  const spans = [1, 2, 3, 4, 5];
  return spans[Math.floor(Math.random() * spans.length)];
};

const ExplorePageComponent = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [searchContent, setSearchedContent] = useState("");
  const [activeHashtag, setActiveHashtag] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const allPosts = await getAllPublicPostsForExplore();
        setAllPosts(allPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchAllPosts();
  }, []);

  const allAvailableHashtags = [...new Set(
    allPosts
      .filter(post => post.hashtags)
      .flatMap(post => post.hashtags.map(hashtag => hashtag.toLowerCase()))
  )];

  const filteredPosts = allPosts.filter(post => {
    const lowercasedSearchContent = searchContent.toLowerCase();
    const lowercasedActiveHashtag = activeHashtag.toLowerCase();
    const username = post?.userId?.username?.toLowerCase() ?? "";
    const name = post.name?.toLowerCase() ?? "";
    const captions = post.captions?.toLowerCase() ?? "";
    const location = post.location?.toLowerCase() ?? "";
    const hashtags = post.hashtags?.map(hashtag => hashtag.toLowerCase()) ?? [];

    return (
      username.includes(lowercasedSearchContent) ||
      name.includes(lowercasedSearchContent) ||
      captions.includes(lowercasedSearchContent) ||
      location.includes(lowercasedSearchContent) ||
      (lowercasedActiveHashtag &&
        hashtags.some(hashtag => hashtag.includes(lowercasedActiveHashtag)))
    );
  });

  return (
    <Layout>
      <main className="bg-gray-100 min-h-screen dark:bg-gray-900 text-black dark:text-white gap-2 pt-2 pr-2~ lg:p-2 w-full   overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-2">
          <div className="pl-2 rounded-lg w-full bg-gray-200 dark:bg-slate-800 flex items-center">
            <FaSearch
              onClick={() => { setSearchedContent(''); setActiveHashtag(""); }}
              className="w-8 h-8 bg-gray-200 dark:bg-gray-800 p-2 rounded-lg"
            />
            <input
              type="text"
              onChange={(e) => {
                setSearchedContent(e.target.value);
                setActiveHashtag("");
              }}
              placeholder="Search username, hashtags, locations, captions.."
              className="bg-gray-200 dark:bg-gray-800 text-white w-full p-2 rounded-lg mr-2 focus:outline-none"
            />
          </div>
          <div className="p-2 rounded-lg w-full bg-slate-100 dark:bg-slate-900 flex-nowrap gap-2 mb-2 overflow-x-auto no-scrollbar flex">
            {allAvailableHashtags.map((hashtag, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveHashtag(hashtag);
                  setSearchedContent(hashtag);
                }}
                className={`p-2 rounded-lg ${
                  activeHashtag === hashtag
                    ? "bg-slate-300 dark:bg-slate-700  text-black dark:text-white"
                    : "bg-slate-100 dark:bg-slate-800  text-black dark:text-white"
                }`}
              >
                {hashtag}
              </button>
            ))}
          </div>
        </div>
        <div className="h-full w-full overflow-y-auto no-scrollbar p-2 bg-gray-100 dark:bg-gray-900 mb-2 md:mb-4 lg:mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {filteredPosts.map((post, index) => (
              <React.Fragment key={post._id + index}>
                {post.images && (
                  <div
                    onClick={() => navigate(`/post/${post._id}`)}
                    className={`col-span-${getRandomSpan()} row-span-${getRandomSpan()} w-full h-full cursor-pointer`}
                  >
                    <MediaItem type="image" src={post.images} />
                  </div>
                )}
                {post.videos && (
                  <div
                    onClick={() => navigate(`/post/${post._id}`)}
                    className={`col-span-${getRandomSpan()} row-span-${getRandomSpan()} w-full h-full cursor-pointer`}
                  >
                    <MediaItem type="video" src={post.videos} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="p-24 bg-slate-100  dark:bg-slate-900"></div>
        </div>
      </main>
    </Layout>
  );
};

export default ExplorePageComponent;
