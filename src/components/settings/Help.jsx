import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faEnvelope,
  faPhoneVolume,
  faFax
} from "@fortawesome/free-solid-svg-icons";

function Help() {
  return (
    <div className="w-11/12 h-5/6 p-2 text-white flex flex-col">
      <div className="w-full h-1/5 flex flex-col items-center justify-center">
        <h1 className="font-inter text-2xl font-semibold border-b-2">How Can We Help You?</h1>
        <p className="text-center p-5">We're committed to ensuring your journey on our platform is smooth and enjoyable. Let's explore and get you back to what you love doing most on our site!</p>
      </div>
      <div className="w-full h-4/5 p-2 flex text-primary-blue dark:text-white">
        <div className="w-1/2 h-full pl-2 pt-2 pb-2 flex flex-col ">
          <div className="h-1/2 w-full pl-2 pr-1 pt-3 pb-2 flex items-center justify-center ">
            <div className="h-full w-full bg-ternary-blue p-3 rounded-lg drop-shadow-lg dark:bg-dark-ternary dark:shadow-md dark:shadow-dark-secondary text-center">
              <FontAwesomeIcon className="text-3xl" icon={faLocationDot} />
              <h1 className="font-inter text-lg font-semibold">
                OUR MAIN OFFICE
              </h1>
              <p>Sabaragamuwa University of Sri Lanka, Belihuloya.</p>
            </div>
          </div>
          <div className="h-1/2 w-full pl-2 pr-1 pt-3 pb-2 flex items-center justify-center">
            <div className="h-full w-full bg-ternary-blue p-3 rounded-lg drop-shadow-lg dark:bg-dark-ternary dark:shadow-md dark:shadow-dark-secondary text-center">
              <FontAwesomeIcon className="text-3xl" icon={faPhoneVolume} />
              <h1 className="font-inter text-lg font-semibold">PHONE NUMBER</h1>
              <p>011 3631245</p>
            </div>
          </div>
        </div>
        <div className="w-1/2 h-full pr-2 pt-2 pb-2 flex flex-col">
          <div className="h-1/2 w-full pl-1 pr-2 pt-3 pb-2 flex items-center justify-center">
            <div className="h-full w-full bg-ternary-blue p-3 rounded-lg drop-shadow-lg dark:bg-dark-ternary dark:shadow-md dark:shadow-dark-secondary text-center">
              <FontAwesomeIcon className="text-3xl" icon={faEnvelope} />
              <h1 className="font-inter text-lg font-semibold">EMAIL</h1>
              <p>dtmsolutions@gmail.com</p>
            </div>
          </div>
          <div className="h-1/2 w-full pl-1 pr-2 pt-3 pb-2 flex items-center justify-center">
            <div className="h-full w-full bg-ternary-blue p-3 rounded-lg drop-shadow-lg dark:bg-dark-ternary dark:shadow-md dark:shadow-dark-secondary text-center">
              <FontAwesomeIcon className="text-3xl" icon={faFax} />
              <h1 className="font-inter text-lg font-semibold">FAX</h1>
              <p>011 3631245</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;
