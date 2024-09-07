import React from "react";
import { FaSearch } from "react-icons/fa";

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="bg-slate-100 dark:bg-slate-900">
      <form
        action=""
        className="flex items-center bg-white dark:bg-slate-800 pl-2 rounded-full shadow-md">
        <button
          type="button"
          className="p-2 rounded-full"
          aria-label="Submit search">
          <FaSearch className="text-gray-500 dark:text-gray-300" />
        </button>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full p-2 pr-4 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border-none outline-none rounded-full"
          aria-label="Search"
        />
      </form>
    </div>
  );
};

export default SearchInput;
