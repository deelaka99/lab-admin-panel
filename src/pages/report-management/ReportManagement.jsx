import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCirclePlus,
  faListCheck,
  faFileExport,
} from "@fortawesome/free-solid-svg-icons";

import AddNewReport from "../../components/reportManagement/AddNewReport";
import ManageReports from "../../components/reportManagement/ManageReports";
import SendReports from "../../components/reportManagement/SendReports";

function ReportManagement() {
  const [activeComponent, setActiveComponent] = useState("AddNewUsers");

  const handleButtonClick = (componentName) => {
    setActiveComponent(componentName);
  };
  return (
    <>
      <div className="w-11/12 h-5/6 flex bg-ternary-blue drop-shadow-2xl rounded-xl border-2 border-white dark:border-dark-ternary dark:bg-dark-ternary dark:shadow-lg dark:shadow-dark-primary">
        <div className="h-full w-1/5 flex flex-col rounded-lg">
          <div className="h-2/6 w-ful"></div>
          <div className="h-4/6 w-full flex flex-col items-start justify-center pt-8 pb-8 pl-3 pr-3 text-primary-blue dark:text-silver">
            <button
              className={`${
                activeComponent === "AddNewReport"
                  ? "bg-primary-blue bg-opacity-25 border-2 border-primary-blue dark:text-primary-blue dark:bg-dark-secondary"
                  : "text-primary-blue hover:font-bold "
              } h-1/3 w-full font-semibold text-lg rounded-lg active:text-secondary-blue active:border-secondary-blue dark:active:text-secondary-blue`}
              onClick={() => handleButtonClick("AddNewReport")}
            >
              <div className="h-full w-full p-3 flex items-center">
                <FontAwesomeIcon icon={faFileCirclePlus} />&nbsp;Add New Report
              </div>
            </button>
            <button
              className={`${
                activeComponent === "ManageReports"
                  ? "bg-primary-blue bg-opacity-25 border-2 border-primary-blue dark:text-primary-blue dark:bg-dark-secondary"
                  : "text-primary-blue hover:font-bold "
              } h-1/3 w-full font-semibold text-lg rounded-lg active:text-secondary-blue active:border-secondary-blue dark:active:text-secondary-blue`}
              onClick={() => handleButtonClick("ManageReports")}
            >
              <div className="h-full w-full p-3 flex items-center">
                <FontAwesomeIcon icon={faListCheck} />&nbsp;Manage Reports
              </div>
            </button>
            <button
              className={`${
                activeComponent === "SendReports"
                  ? "bg-primary-blue bg-opacity-25 border-2 border-primary-blue dark:text-primary-blue dark:bg-dark-secondary"
                  : "text-primary-blue hover:font-bold "
              } h-1/3 w-full font-semibold text-lg rounded-lg active:text-secondary-blue active:border-secondary-blue dark:active:text-secondary-blue`}
              onClick={() => handleButtonClick("SendReports")}
            >
              <div className="h-full w-full p-3 flex items-center">
                <FontAwesomeIcon icon={faFileExport} />&nbsp;Send Reports
              </div>
            </button>
          </div>
          <div className="h-2/6 w-ful"></div>
        </div>
        <div className="h-full w-4/5 bg-primary-blue bg-opacity-70 rounded-br-xl rounded-tr-xl dark:bg-dark-primary flex justify-center items-center">
          {activeComponent === "AddNewReport" && <AddNewReport />}
          {activeComponent === "ManageReports" && <ManageReports />}
          {activeComponent === "SendReports" && <SendReports />}
        </div>
      </div>
    </>
  );
}

export default ReportManagement;
