import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faMagnifyingGlass,
  faCaretDown,
  faCaretUp,
} from "@fortawesome/free-solid-svg-icons";

import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { logout } from "../../firebase";
import Switcher from "../darkMode/Switcher";

const Navbar = () => {
  const [user] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/**Search bar */}
      <div className="h-full w-2/5 flex justify-center items-center ">
        <div className="bg-ternary-blue h-1/2 w-2/3 rounded-3xl opacity-100 flex drop-shadow-xl dark:bg-dark-ternary">
          <div className="h-full w-10/12 rounded-3xl flex justify-center items-center ">
            Search...
          </div>
          <div className="bg-bermuda  h-full w-2/12 rounded-3xl flex justify-center items-center drop-shadow-xl hover:text-silver dark:bg-dark-primary dark:text-dark-ternary dark:hover:text-silver">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </div>
        </div>
      </div>

      {/**space */}
      <div className="h-full w-1/5"></div>

      {/**Dark mode & user */}
      <div className="h-full w-2/5 flex">
        {/**Dark mode button */}
        <div className=" h-full w-1/5 flex justify-center items-center">
          <div className="bg-bermuda dark:bg-dark-secondary rounded-full h-1/2 w-1/2 flex items-center justify-center">
            <Switcher />
          </div>
        </div>
        {/**user button */}
        <div className="relative h-full w-4/5 flex justify-center items-center">
          <div className="bg-bermuda h-1/2 w-5/6 rounded-full flex justify-center items-center drop-shadow-xl p-3 dark:bg-dark-ternary">
            <FontAwesomeIcon
              icon={faUser}
              className="w-1/6 font-medium p-1 dark:text-white"
            />
            <h6 className="text-black text-center w-4/6  dark:text-white">
              {user ? (
                <div className="w-full text-xs font-bold">{user.email}</div>
              ) : (
                <div>No user</div>
              )}
            </h6>
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="p-4 w-1/6 flex items-center justify-between active:text-white"
            >
              {!isOpen ? (
                <FontAwesomeIcon
                  icon={faCaretDown}
                  className="dark:text-white"
                />
              ) : (
                <FontAwesomeIcon icon={faCaretUp} className="dark:text-white" />
              )}
            </button>
          </div>
          {isOpen && (
            <div className="bg-white absolute top-20 flex flex-col items-start rounded-lg p-5 w-full drop-shadow-xl ">
              <div className="flex flex-col">
                <div className="h-1/2 w-full ">
                  <button className="text-red" onClick={logout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
