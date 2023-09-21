import React from "react";
import SearchBar from "../searchbar/SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown, faUserPlus } from "@fortawesome/free-solid-svg-icons";

function ManageUsers() {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex w-full h-1/6">
        <div className="flex justify-center items-center h-full w-1/2">
          <SearchBar />
        </div>
        <div className="flex items-center justify-end h-full w-1/2 p-5">
          <button className="p-2 border border-ternary-blue text-ternary-blue text-lg rounded shadow-md hover:shadow-lg hover:text-white hover:border-white dark:text-gray2 dark:border-gray2 dark:shadow-black dark:hover:text-gray1 dark:hover:border-gray1">
            <FontAwesomeIcon icon={faFileArrowDown} />
          </button>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
          <button className="p-2 border border-ternary-blue font-inter bg-primary-blue text-ternary-blue text-lg rounded shadow-md hover:shadow-lg hover:text-white hover:border-white dark:bg-black dark:bg-opacity-50 dark:text-gray2 dark:border-gray2 dark:shadow-black dark:hover:text-gray1 dark:hover:border-gray1">
            <FontAwesomeIcon icon={faUserPlus} />
            &nbsp;&nbsp;Add New User
          </button>
        </div>
      </div>
      <div className="bg-red w-full h-5/6"></div>
    </div>
  );
}

export default ManageUsers;
