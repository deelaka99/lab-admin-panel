import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faPeopleRoof,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";

import AddNewUsers from "../../components/UserManagement/AddNewUser";
import ManageUsers from "../../components/UserManagement/ManageUsers";
import Payment from "../../components/UserManagement/Payment";

function UserManagement() {
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
                activeComponent === "AddNewUsers"
                  ? "bg-primary-blue bg-opacity-25 border-2 border-primary-blue dark:text-primary-blue dark:bg-dark-secondary"
                  : "text-primary-blue hover:font-bold "
              } h-1/3 w-full font-semibold text-xl rounded-lg active:text-secondary-blue active:border-secondary-blue dark:active:text-secondary-blue`}
              onClick={() => handleButtonClick("AddNewUsers")}
            >
              <div className="h-full w-full p-3 flex items-center">
                <FontAwesomeIcon icon={faUserPlus} /> &nbsp;Add New Users
              </div>
            </button>
            <button
              className={`${
                activeComponent === "ManageUsers"
                ? "bg-primary-blue bg-opacity-25 border-2 border-primary-blue dark:text-primary-blue dark:bg-dark-secondary"
                : "text-primary-blue hover:font-bold "
            } h-1/3 w-full font-semibold text-xl rounded-lg active:text-secondary-blue active:border-secondary-blue dark:active:text-secondary-blue`}
              onClick={() => handleButtonClick("ManageUsers")}
            >
              <div className="h-full w-full p-3 flex items-center">
                <FontAwesomeIcon icon={faPeopleRoof} /> &nbsp;Manage Users
              </div>
            </button>
            <button
              className={`${
                activeComponent === "Payment"
                ? "bg-primary-blue bg-opacity-25 border-2 border-primary-blue dark:text-primary-blue dark:bg-dark-secondary"
                : "text-primary-blue hover:font-bold "
            } h-1/3 w-full font-semibold text-xl rounded-lg active:text-secondary-blue active:border-secondary-blue dark:active:text-secondary-blue`}
              onClick={() => handleButtonClick("Payment")}
            >
              <div className="h-full w-full p-3 flex items-center">
                <FontAwesomeIcon icon={faCreditCard} /> &nbsp;Payment
              </div>
            </button>
          </div>
          <div className="h-2/6 w-ful"></div>
        </div>
        <div className="h-full w-4/5 bg-primary-blue bg-opacity-70 rounded-br-xl rounded-tr-xl dark:bg-dark-primary flex justify-center items-center">
          {activeComponent === "AddNewUsers" && <AddNewUsers />}
          {activeComponent === "ManageUsers" && <ManageUsers />}
          {activeComponent === "Payment" && <Payment />}
        </div>
      </div>
    </>
  );
}

export default UserManagement;
