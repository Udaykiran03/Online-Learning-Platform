import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaChevronDown } from "react-icons/fa";
import { RxMagnifyingGlass } from "react-icons/rx";
import { IoMdInformationCircleOutline } from "react-icons/io";

const SearchBar = ({ dropdownOptions, handleSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    handleSearch(e.target.value, selectedFilter);
  };

  const handleDropdownChange = (e) => {
    setSelectedFilter(e.target.value);
    handleSearch(searchTerm, e.target.value);
  };

  return (
    <form action="#" className="mx-auto">
      <div className="flex relative">
        <select
          className="block py-2.5 px-4 w-fit z-10 text-sm text-gray-900 bg-gray-100 rounded-l-lg border border-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300"
          onChange={handleDropdownChange}
        >
          <option value="">All Categories</option>
          {dropdownOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="block p-2.5 w-96 z-20 text-sm focus:ring-4 focus:ring-gray-300 text-gray-900 bg-gray-50 border border-gray-300 focus:outline-none"
          placeholder="Search Courses..."
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button className="top-0 end-0 p-2.5 font-medium h-full text-white bg-blue-500 rounded-e-lg border border-blue-500 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 text-lg">
          <RxMagnifyingGlass />
          <span className="sr-only">Search</span>
        </button>
        <span className="absolute -right-24 top-1.5 p-1 text-sm rounded-full bg-violet-100 text-violet-500 flex items-center gap-1">
          <IoMdInformationCircleOutline /> Bonus
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-300 opacity-50"></span>
        </span>
      </div>
    </form>
  );
};

SearchBar.propTypes = {
  dropdownOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleSearch: PropTypes.func.isRequired,
};

export default SearchBar;
