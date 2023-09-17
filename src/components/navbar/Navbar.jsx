import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import Switcher from "../darkMode/Switcher";
import logo from "../../assets/images/signin-bg.jpg";
import { auth, db } from "../../firebase";
import { ref, onValue } from "firebase/database";

const Navbar = () => {
  const user = auth.currentUser;
  const [timeOfDay, setTimeOfDay] = useState("");

  const [labData, setLabData] = useState({
    LabName: "",
    address: "",
    amount: "",
    blocked: "",
    district: "",
    email: "",
    password: "",
    paymentDate: "",
    province: "",
    telephone: "",
    type: "",
    userName: "",
    uuid: "",
  });

  useEffect(() => {
    //show greetings according to time
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour >= 5 && currentHour < 12) {
      setTimeOfDay("Good morning!");
    } else if (currentHour >= 12 && currentHour < 17) {
      setTimeOfDay("Good afternoon!");
    } else {
      setTimeOfDay("Good evening!");
    }

    // Fetch admin data from Realtime Database
    if (user) {
      const labRef = ref(db, `labs/${user.uid}`);
      onValue(labRef, (snapshot) => {
        if (snapshot.exists()) {
          const adminDetails = snapshot.val();
          setLabData(adminDetails);
        }
      });
    }
  }, []);

  return (
    <>
      {/**Search bar */}
      <div className="h-full w-2/5 flex justify-center items-center ">
        <div className="bg-ternary-blue h-2/3 w-2/3 rounded-3xl flex border-2 border-white hover:shadow-lg dark:border-gray2 dark:bg-dark-ternary">
          <div className="h-full w-10/12 text-[9px] sm:text-[10px] md:text-[12px] lg:text-[14px] text-dark-ternary flex p-5 items-center dark:text-gray2">
            Search...
          </div>
          <div className="h-full w-2/12 flex justify-center items-center text-[9px] sm:text-[10px] md:text-[12px] lg:text-[14px] drop-shadow-xl text-dark-ternary hover:text-dark-primary dark:text-gray2 dark:hover:text-gray1">
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
          <div className="bg-white rounded-full h-[30px] w-[30px]  sm:h-[37px] sm:w-[37px] md:h-[41px] md:w-[41px] lg:h-[45px] lg:w-[45px] border-2 border-silver shadow-lg hover:shadow-xl hover:w-[50px] hover:h-[50px] dark:bg-dark-primary dark:hover:dark:bg-dark-secondary dark:border-dark-secondary dark:hover:border-dark-primary flex items-center justify-center">
            <Switcher />
          </div>
        </div>
        {/**user button */}
        <div className="h-full w-4/5 flex justify-center items-center">
          <div className="flex items-center justify-center h-full w-3/4 ">
            <h6 className="flex items-center justify-end text-dark-ternary text-[9px] sm:text-[10px] md:text-[12px] lg:text-[14px] font-inter w-4/6  dark:text-white">
              {timeOfDay}&nbsp;{user !== null ? labData.LabName : "no-user"}
            </h6>
          </div>
          <div className="flex justify-center items-center md:border-l-2 lg:border-l-4 border-dark-ternary dark:border-ternary-blue Sh-full w-1/4 ">
            <div className="bg-white shadow-xl border-2  border-dark-ternary h-[30px] w-[30px]  sm:h-[37px] sm:w-[37px] md:h-[41px] md:w-[41px] lg:h-[45px] lg:w-[45px] rounded-full dark:border-silver">
              <img
                className="h-[28px] w-[28px] sm:h-[35px] sm:w-[35px] md:h-[39px] md:w-[39px] lg:h-[43px] lg:w-[43px] rounded-full"
                src={logo}
                alt="user-logo"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
