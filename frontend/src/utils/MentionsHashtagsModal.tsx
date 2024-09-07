import React from "react";
import { useNavigate } from "react-router-dom";

interface HashtagsProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  data: string[];
}

const MentionsHashtagsModal: React.FC<HashtagsProps> = ({
  isOpen,
  title,
  onClose,
  data,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center gap-5">
          <h2 className="text-xl text-black dark:text-white font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            X
          </button>
        </div>

        <ul className="mt-4">
          {data.length === 0 ? (
            <li className="p-2 text-black dark:text-white">No {title} Available</li>
          ) : (
            data.map((item, index) => (
              <li
                key={index}
                className="p-2 border-b text-black dark:text-white border-gray-200 dark:border-gray-600 cursor-pointer"
                onClick={() => title === "Mentions" && navigate(`/profiles/${item}`)}>
                {title === "Mentions" ? `@${item}` : `#${item}`}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default MentionsHashtagsModal;
