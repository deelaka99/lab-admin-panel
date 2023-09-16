import { React, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faFileLines,
  faHome,
  faUsers,
  faUser,
  faGear,
  faMoneyCheckDollar,
  faAddressCard
} from "@fortawesome/free-solid-svg-icons";


import { logout } from "../../firebase";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";

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
      <div className="h-1/6 w-full">
        <div className="flex items-center justify-center p-3 ">
          <img src={logo} alt="logo" className="h-3/4 w-3/4" />
        </div>
      </div>

      {/*second raw*/}
      <div className="h-4/6 w-full">
        <div className="flex flex-col p-1">
          {/* {sideBarItems.map((item)=> <>{item}</>)} */}
          <NavLink
            to="/admin/dashboard"
            className={`${
              activeLink === "dashboard"
                ? "text-primary-blue bg-ternary-blue rounded-full dark:bg-dark-secondary"
                : "hover:bg-ternary-blue hover:opacity-80 hover:text-primary-blue hover:rounded-full text-ternary-blue dark:hover:bg-dark-secondary"
            } hover:bg-ternary-blue dark:hover:bg-dark-secondary text-2xl font-inter pl-5 p-3`}
            onClick={() => setActiveLink("dashboard")}
          >
            <div>
              <FontAwesomeIcon icon={faHome} /> &nbsp;Dashboard
            </div>
          </NavLink>

          <NavLink
            to="/admin/user-management"
            className={`${
              activeLink === "user-management"
                ? "text-primary-blue bg-ternary-blue rounded-full dark:bg-dark-secondary"
                : "hover:bg-ternary-blue hover:opacity-80 hover:text-primary-blue hover:rounded-full text-ternary-blue dark:hover:bg-dark-secondary"
            } hover:bg-ternary-blue dark:hover:bg-dark-secondary text-2xl font-inter pl-5 p-3`}
            onClick={() => setActiveLink("user-management")}
          >
            <div>
              <FontAwesomeIcon icon={faUsers} /> &nbsp;User management
            </div>
          </NavLink>
          
          <NavLink
            to="/admin/report-management"
            className={`${
              activeLink === "report-management"
                ? "text-primary-blue bg-ternary-blue rounded-full dark:bg-dark-secondary"
                : "hover:bg-ternary-blue hover:opacity-80 hover:text-primary-blue hover:rounded-full text-ternary-blue dark:hover:bg-dark-secondary"
            } hover:bg-ternary-blue dark:hover:bg-dark-secondary text-2xl font-inter pl-5 p-3`}
            onClick={() => setActiveLink("report-management")}
          >
            <div>
              <FontAwesomeIcon icon={faFileLines} /> &nbsp;Report management
            </div>
          </NavLink>

          <NavLink
            to="/admin/company-payments"
            className={`${
              activeLink === "company-payments"
                ? "text-primary-blue bg-ternary-blue rounded-full dark:bg-dark-secondary"
                : "hover:bg-ternary-blue hover:opacity-80 hover:text-primary-blue hover:rounded-full text-ternary-blue dark:hover:bg-dark-secondary"
            } hover:bg-ternary-blue dark:hover:bg-dark-secondary text-[23px] font-inter pl-5 p-3`}
            onClick={() => setActiveLink("company-payments")}
          >
            <div>
              <FontAwesomeIcon icon={faMoneyCheckDollar} /> &nbsp;Company payments
            </div>
          </NavLink>

          <NavLink
            to="/admin/about-us"
            className={`${
              activeLink === "about-us"
                ? "text-primary-blue bg-ternary-blue rounded-full dark:bg-dark-secondary"
                : "hover:bg-ternary-blue hover:opacity-80 hover:text-primary-blue hover:rounded-full text-ternary-blue dark:hover:bg-dark-secondary"
            } hover:bg-ternary-blue dark:hover:bg-dark-secondary text-2xl font-inter pl-5 p-3`}
            onClick={() => setActiveLink("about-us")}
          >
            <div>
              <FontAwesomeIcon icon={faAddressCard} /> &nbsp;About us
            </div>
          </NavLink>

          <NavLink
            to="/admin/settings"
            className={`${
              activeLink === "settings"
                ? "text-primary-blue bg-ternary-blue rounded-full dark:bg-dark-secondary"
                : "hover:bg-ternary-blue hover:opacity-80 hover:text-primary-blue hover:rounded-full text-ternary-blue dark:hover:bg-dark-secondary"
            } hover:bg-ternary-blue dark:hover:bg-dark-secondary text-2xl font-inter pl-5 p-3`}
            onClick={() => setActiveLink("settings")}
          >
            <div>
              <FontAwesomeIcon icon={faGear} /> &nbsp;Settings
            </div>
          </NavLink>
        </div>
      </div>

      {/*third raw*/}
      <div className="flex items-center justify-center p-3 h-1/6 w-full">
        <button
          className="flex items-center justify-center p-3 w-3/4 rounded-lg text-2xl font-inter bg-primary-blue border-2 text-white shadow-xl hover:bg-blue1 dark:bg-dark-primary dark:hover:bg-dark-secondary"
          onClick={logoutHandler}
        >
          <FontAwesomeIcon icon={faRightFromBracket} /> &nbsp;Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;
