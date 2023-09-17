import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

import Switcher from "../darkMode/Switcher";
import logo from "../../assets/images/signin-bg.jpg"

const Navbar = () => {

  return (
    <>
      {/**Search bar  */}
      <div className="h-full w-2/5 flex justify-center items-center ">
        <div className="bg-ternary-blue h-2/3 w-2/3 rounded-3xl flex border-2 border-white hover:shadow-lg dark:border-gray2 dark:bg-dark-ternary">
          <div className="h-full w-10/12 rounded-3xl text-dark-ternary flex p-5 items-center dark:text-gray2">
            Search...
          </div>
          <div className="h-full w-2/12 rounded-3xl flex justify-center items-center drop-shadow-xl text-dark-ternary hover:text-dark-primary dark:text-gray2 dark:hover:text-gray1">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </div>
        </div>
      </div>

      {/**space */}
      <div className="h-full w-1/5"></div>

      {/**Dark mode & user */}
      <div className="h-full w-2/5 flex">
        {/**Dark mode button */}
        <div className="h-full w-1/5 flex justify-center items-center">
          <div className="bg-white rounded-full h-[45px] w-[45px] border-2 border-silver shadow-lg hover:shadow-xl hover:w-[50px] hover:h-[50px] dark:bg-dark-primary dark:hover:dark:bg-dark-secondary dark:border-dark-secondary dark:hover:border-dark-primary flex items-center justify-center">
            <Switcher />
          </div>
        </div>
        {/**user button */}
        <div className="h-full w-4/5 flex justify-center items-center">
          <div className="flex items-center justify-center h-full w-3/4 ">
            <h6 className="flex items-center justify-end text-black text-[18px] font-inter w-4/6  dark:text-white">
              Hi, Deelaka Wejith
              {/* {user ? (
                <div className="w-full text-xs font-bold">{user.email}</div>
              ) : (
                <div>No user</div>
              )} */}
            </h6>
          </div>
          <div className="flex justify-left items-center Sh-full w-1/4 ">
            <div className="bg-white shadow-lg border-2  border-silver h-[55px] w-[55px] rounded-full">
              <img className="h-[53px] w-[53px] rounded-full" src={logo} alt="user-logo" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
