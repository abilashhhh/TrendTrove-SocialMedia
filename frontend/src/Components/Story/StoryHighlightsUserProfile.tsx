import React from "react";
import CreateNewHighlight from "./CreateNewHighlight";
import DisplayHighlight from "./DisplayHighlight";
import AllStoriesListing from "./AllStoriesListing";

const StoryHighlightsUserProfile = () => {
  return (
    <div>
      <div className="w-full p-2 mb-10">
        <h1 className="font-semibold underline text-2xl p-2 ">
          MY STORY HIGHLIGHTS
        </h1>

        <div className="flex gap-2 overflow-y-auto no-scrollbar w-full h-full">
          <CreateNewHighlight />
          <DisplayHighlight />
        </div>
      </div>
      <AllStoriesListing />
    </div>
  );
};

export default StoryHighlightsUserProfile;
