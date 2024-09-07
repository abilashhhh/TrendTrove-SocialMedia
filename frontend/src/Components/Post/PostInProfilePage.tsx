  import React, { useState } from "react";
  import { CSSTransition, TransitionGroup } from "react-transition-group";
  import TaggedPostComponent from "./TaggedPostComponent";
  import SavedPostComponent from "./SavedPostComponent";
  import MyPostComponent from "./MyPostComponent";
  import StoryHighlightsUserProfile from "../Story/StoryHighlightsUserProfile";
  import "../styling.css";  

  const PostInProfilePage = () => {
    const [activeSection, setActiveSection] = useState("MY POSTS");
    const sections = ["MY POSTS", "SAVED POSTS", "TAGGED POSTS", "STORY HIGHLIGHTS"];

    const renderActiveSection = () => {
      switch (activeSection) {
        case "MY POSTS":
          return <MyPostComponent />;
        case "SAVED POSTS":
          return <SavedPostComponent />;
        case "TAGGED POSTS":
          return <TaggedPostComponent />;
        case "STORY HIGHLIGHTS":
          return <StoryHighlightsUserProfile />;
        default:
          return null;
      }
    };

    return (
      <>
        <div className="flex flex-col md:flex-row justify-between px-8 py-2 mt-2 rounded-lg shadow-lg gap-4">
          {sections.map(section => (
            <button
              key={section}
              className={`p-3 rounded-lg border-2 font-bold ${
                activeSection === section
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-black dark:text-white dark:bg-slate-900 border-red-500"
              }`}
              onClick={() => setActiveSection(section)}>
              {section}
            </button>
          ))}
        </div>

        <div className="mt-4 p-2 bg-white text-black dark:text-white dark:bg-slate-900 rounded-lg shadow-lg">
          <TransitionGroup>
            <CSSTransition
              key={activeSection}
              timeout={300}
              classNames="fade"
            >
              <div>{renderActiveSection()}</div>
            </CSSTransition>
          </TransitionGroup>
        </div>
      </>
    );
  };

  export default PostInProfilePage;
