import React, { useEffect, useState } from "react";
import {
  getHighlightsUsingUsername,
  getStoriesForHighlightsUsingUsername,
} from "../../../API/Post/post";
import { GiNextButton } from "react-icons/gi";
import { GiPreviousButton } from "react-icons/gi";
import { IoMdCloseCircle } from "react-icons/io";
import { useSwipeable } from 'react-swipeable';

const HighlightsDisplay = ({ username }) => {
  const [highlightsData, setHighlightsData] = useState([]);
  const [storyhighlights, setStoryhighlights] = useState([]);
  const [selectedHighlight, setSelectedHighlight] = useState(null);
  const [storyLargeScreen, setStoryLargeScreen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  useEffect(() => {
    const getAllUserHighlights = async () => {
      const stories = await getHighlightsUsingUsername(username);
      if (stories.status === "success") {
        setHighlightsData(stories?.data);
      }
    };
    getAllUserHighlights();
  }, [username]);

  useEffect(() => {
    const getAllStoriesOfUser = async () => {
      const stories = await getStoriesForHighlightsUsingUsername(username);
      if (stories.status === "success") {
        setStoryhighlights(stories?.data);
      }
    };
    getAllStoriesOfUser();
  }, [username]);

  const handlePrevStory = () => {
    setSelectedStoryIndex(prevIndex =>
      prevIndex === 0 ? (filteredStories.length || 1) - 1 : prevIndex - 1
    );
  };

  const handleNextStory = () => {
    setSelectedStoryIndex(prevIndex =>
      prevIndex === (filteredStories.length || 1) - 1 ? 0 : prevIndex + 1
    );
  };

  const filteredStories = storyhighlights.filter(story =>
    highlightsData
      .filter(highlight => highlight._id === selectedHighlight)
      .flatMap(highlight => highlight.selectedStories)
      .includes(story._id)
  );

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNextStory(),
    onSwipedRight: () => handlePrevStory(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  return (
    <div>
      <div className="rounded-lg flex gap-2 overflow-y-auto no-scrollbar w-full h-full">
        {highlightsData &&
          highlightsData.map((highlight, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-lg p-2 flex-shrink-0 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                setSelectedHighlight(highlight._id);
                setStoryLargeScreen(true);
                setSelectedStoryIndex(0);
              }}>
              <div>
                <img
                  className="rounded-full w-16 h-16 sm:w-16 sm:h-16 md:w-16 md:h-16 lg:w-24 lg:h-24"
                  src={highlight.coverImage}
                  alt="highlight"
                />
              </div>
              <div className="text-center text-sm mt-2 flex gap-2 items-center">
                {highlight.highlightName}
              </div>
            </div>
          ))}
      </div>

      {storyLargeScreen && filteredStories.length > 0 && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50"
          onClick={() => setStoryLargeScreen(false)}
        >
          <div
            className="relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center items-center max-h-xl w-full" {...handlers}>
              <button
                onClick={handlePrevStory}
                className="text-white dark:text-slate-400 px-4 py-2 rounded-lg"
              >
                <GiPreviousButton />
              </button>
              <div className="relative rounded-lg transition-all duration-300 h-[calc(100vh-16rem)] w-full">
                {filteredStories[selectedStoryIndex].mediaType === 'image' ? (
                  <img
                    src={filteredStories[selectedStoryIndex].mediaUrl}
                    alt="Story"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <video
                    src={filteredStories[selectedStoryIndex].mediaUrl}
                    controls
                    autoPlay
                    muted
                    className="object-cover w-full h-full"
                  />
                )}
                <div className="absolute flex items-center justify-center gap-1 top-0 left-0 bg-gray-900 p-2 text-white text-center text-xs font-semibold">
                  <img
                    src={filteredStories[selectedStoryIndex].userId.dp}
                    className="w-6 h-6 rounded-full"
                    alt="DP"
                  />
                  {filteredStories[selectedStoryIndex]?.userId?.username || 'Sample User'}
                </div>
                {filteredStories[selectedStoryIndex].captions && (
                  <div className="absolute bottom-0 left-0 right-0 bg-slate-900 p-2 text-white text-center break-all">
                    {filteredStories[selectedStoryIndex]?.captions}
                  </div>
                )}
              </div>
              <button
                onClick={handleNextStory}
                className="text-white dark:text-slate-400 px-4 py-2 rounded-lg"
              >
                <GiNextButton />
              </button>
            </div>
            <div className="flex justify-center m-2">
              <button
                onClick={() => setStoryLargeScreen(false)}
                className="text-white dark:text-slate-400 px-4 py-2 rounded-lg"
              >
                <IoMdCloseCircle />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HighlightsDisplay;
