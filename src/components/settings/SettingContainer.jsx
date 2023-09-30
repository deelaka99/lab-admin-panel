import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faShieldHalved,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import Notification from "./Notification";
import Security from "./Security";
import LabProfile from "./LabProfile";

function SettingContainer() {
  const [activeComponent, setActiveComponent] = useState("labProfile");

  const handleButtonClick = (componentName) => {
    setActiveComponent(componentName);
  };
  return (
    <>
      <div className="w-11/12 h-5/6 flex bg-ternary-blue drop-shadow-2xl border-2 border-white rounded-xl dark:bg-dark-ternary dark:border-dark-ternary">
        <div className="h-full w-1/4 flex flex-col rounded-lg">
          <div className="h-2/6 w-ful"></div>
          <div className="h-4/6 w-full flex flex-col items-start justify-center pt-8 pb-8 pl-3 pr-3 text-primary-blue dark:text-silver">
            <button
              className={`${
                activeComponent === "labProfile"
                  ? "bg-primary-blue bg-opacity-25 border-2 border-primary-blue dark:text-primary-blue dark:bg-dark-secondary"
                  : "text-primary-blue hover:font-bold "
              }  h-1/3 w-full font-semibold text-xl rounded-lg active:text-secondary-blue active:border-secondary-blue dark:active:text-secondary-blue`}
              onClick={() => handleButtonClick("labProfile")}
            >
              <div className="h-full w-full p-3 flex items-center">
                <FontAwesomeIcon icon={faUser} /> &nbsp;Profile
              </div>
            </button>
            <button
              className={`${
                activeComponent === "Notification"
                  ? "bg-primary-blue bg-opacity-25 border-2 border-primary-blue dark:text-primary-blue dark:bg-dark-secondary"
                  : "text-primary-blue hover:font-bold "
              }  h-1/3 w-full font-semibold text-xl rounded-lg active:text-secondary-blue active:border-secondary-blue dark:active:text-secondary-blue`}
              onClick={() => handleButtonClick("Notification")}
            >
              <div className="h-full w-full p-3 flex items-center">
                <FontAwesomeIcon icon={faBell} /> &nbsp;Notification
              </div>
            </button>
            <button
              className={`${
                activeComponent === "Security"
                  ? "bg-primary-blue bg-opacity-25 border-2 border-primary-blue dark:text-primary-blue dark:bg-dark-secondary"
                  : "text-primary-blue hover:font-bold "
              }  h-1/3 w-full font-semibold text-xl rounded-lg active:text-secondary-blue active:border-secondary-blue dark:active:text-secondary-blue`}
              onClick={() => handleButtonClick("Security")}
            >
              <div className="h-full w-full p-3 flex items-center">
                <FontAwesomeIcon icon={faShieldHalved} /> &nbsp;Security
              </div>
            </button>
          </div>
          <div className="h-2/6 w-ful"></div>
        </div>
        <div className="h-full w-3/4 bg-primary-blue bg-opacity-70 rounded-br-xl rounded-tr-xl dark:bg-dark-primary dark:bg-opacity-70 flex justify-center items-center">
          {activeComponent === "labProfile" && <LabProfile />}
          {activeComponent === "Notification" && <Notification />}
          {activeComponent === "Security" && <Security />}
        </div>
      </div>
    </>
  );
}

export default SettingContainer;
