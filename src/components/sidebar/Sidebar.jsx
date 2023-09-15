import { React, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faTableCellsLarge,
  faCube,
  faUser,
  faGear,
} from "@fortawesome/free-solid-svg-icons";


import { logout } from "../../firebase";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState("dashboard");

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const logoutHandler = () => {
    logout();
  };

  return (
    <>
      {/*first raw*/}
      <div className="h-1/5 w-full">
        <div className="flex items-center justify-center">
          <img src="" alt="logo" className="h-1/2 w-1/2" />
        </div>
      </div>

      {/*second raw*/}
      <div className="h-3/5 w-full">
        <div className="flex flex-col ">
          {/* {sideBarItems.map((item)=> <>{item}</>)} */}
          <NavLink
            to="/admin/dashboard"
            activeClassName="bg-secondary-blue dark:bg-dark-secondary"
            className={`${
              activeLink === "dashboard"
                ? "bg-secondary-blue dark:bg-dark-secondary"
                : "hover:bg-secondary-blue dark:hover:bg-dark-secondary"
            } hover:bg-secondary-blue dark:hover:bg-dark-secondary text-3xl text-white font-inter p-7`}
            onClick={() => setActiveLink("dashboard")}
          >
            <div>
              <FontAwesomeIcon icon={faTableCellsLarge} /> &nbsp;Dashboard
            </div>
          </NavLink>

          <NavLink
            to="/admin/management"
            activeClassName="bg-secondary-blue dark:bg-dark-secondary"
            className={`${
              activeLink === "management"
                ? "bg-secondary-blue dark:bg-dark-secondary"
                : "hover:bg-secondary-blue dark:hover:bg-dark-secondary"
            } hover:bg-secondary-blue dark:hover:bg-dark-secondary text-3xl text-white font-inter p-7`}
            onClick={() => handleLinkClick("management")}
          >
            <div>
              <FontAwesomeIcon icon={faCube} /> &nbsp;Management
            </div>
          </NavLink>

          <NavLink
            to="/admin/profile"
            activeClassName="bg-secondary-blue dark:bg-dark-secondary"
            className={`${
              activeLink === "profile"
                ? "bg-secondary-blue dark:bg-dark-secondary"
                : "hover:bg-secondary-blue dark:hover:bg-dark-secondary"
            } hover:bg-secondary-blue dark:hover:bg-dark-secondary text-3xl text-white font-inter p-7`}
            onClick={() => handleLinkClick("profile")}
          >
            <div>
              <FontAwesomeIcon icon={faUser} /> &nbsp;Profile
            </div>
          </NavLink>

          <NavLink
            to="/admin/settings"
            activeClassName="bg-secondary-blue dark:bg-dark-secondary"
            className={`${
              activeLink === "settings"
                ? "bg-secondary-blue dark:bg-dark-secondary"
                : "hover:bg-secondary-blue dark:hover:bg-dark-secondary"
            } hover:bg-secondary-blue dark:hover:bg-dark-secondary text-3xl text-white font-inter p-7`}
            onClick={() => handleLinkClick("settings")}
          >
            <div>
              <FontAwesomeIcon icon={faGear} /> &nbsp;Settings
            </div>
          </NavLink>
        </div>
      </div>

      {/*third raw*/}
      <div className="h-1/5 w-full">
        <button
          className="text-3xl text-white font-inter w-full flex  hover:bg-secondary-blue dark:hover:bg-dark-secondary"
          onClick={logoutHandler}
        >
          <div className="flex flex-col p-1">
            <div className="p-5">
              <FontAwesomeIcon icon={faRightFromBracket} /> &nbsp;Logout
            </div>
          </div>
        </button>
      </div>
    </>
  );
};

export default Sidebar;
