import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhoneVolume,
  faEnvelope,
  faFax,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

import CompanyLogo from "../../assets/images/company_logo.png";

function AboutUs() {
  return (
    <div className="w-11/12 h-5/6 bg-ternary-blue drop-shadow-2xl border-2 border-white rounded-xl dark:bg-dark-ternary dark:border-dark-ternary">
      <div className="flex h-1/4 w-full pt-2">
        <div className="flex items-center justify-center h-full w-1/6">
          <div className="flex items-center justify-center bg-primary-blue border-4 border-white h-32 w-32 p-2 shadow-lg rounded-lg">
            <img className="h-28 w-28" src={CompanyLogo} alt="companyLogo" />
          </div>
        </div>
        <div className="h-full w-5/6 text-primary-blue font-inter pt-3 pr-3 dark:text-ternary-blue">
          <div className="flex items-center justify-start h-2/6 w-full p-2 font-jomhuria text-4xl border-b">
            Who We Are?
          </div>
          <div className="flex justify-start h-4/6 w-full p-2 font-medium">
            We're committed to ensuring your journey on our platform is smooth
            and enjoyable. Let's explore and get you back to what you love doing
            most on our site!
          </div>
        </div>
      </div>
      <div className="h-3/4 w-full p-3">
        <div className="flex h-full w-full border border-white text-primary-blue dark:text-ternary-blue dark:border-0 rounded p-3">
          <div className="h-full w-1/2">
            <div className="h-1/2 w-full pt-3 pl-3 pr-3">
              <div className="flex flex-col items-center justify-center h-full w-full bg-primary-blue bg-opacity-20 shadow-lg rounded-lg border-2 border-white dark:bg-opacity-50 dark:border dark:border-teranry-blue">
                <FontAwesomeIcon className="text-3xl" icon={faLocationDot} />
                <h1 className="font-inter text-lg font-semibold">
                  OUR MAIN OFFICE
                </h1>
                <p>Sabaragamuwa University of Sri Lanka, Belihuloya.</p>
              </div>
            </div>
            <div className="h-1/2 w-full p-3">
              <div className="flex flex-col items-center justify-center h-full w-full bg-primary-blue bg-opacity-20 shadow-lg rounded-lg border-2 border-white dark:bg-opacity-50 dark:border dark:border-teranry-blue">
                <FontAwesomeIcon className="text-3xl" icon={faPhoneVolume} />
                <h1 className="font-inter text-lg font-semibold">
                  PHONE NUMBER
                </h1>
                <p>011 3631245</p>
              </div>
            </div>
          </div>
          <div className="h-full w-1/2">
            <div className="h-1/2 w-full pt-3 pl-3 pr-3">
              <div className="flex flex-col items-center justify-center h-full w-full bg-primary-blue bg-opacity-20 shadow-lg rounded-lg border-2 border-white dark:bg-opacity-50 dark:border dark:border-teranry-blue">
                <FontAwesomeIcon className="text-3xl" icon={faEnvelope} />
                <h1 className="font-inter text-lg font-semibold">EMAIL</h1>
                <p>dtmsolutions@gmail.com</p>
              </div>
            </div>
            <div className="h-1/2 w-full p-3">
              <div className="flex flex-col items-center justify-center h-full w-full bg-primary-blue bg-opacity-20 shadow-lg rounded-lg border-2 border-white dark:bg-opacity-50 dark:border dark:border-teranry-blue">
                <FontAwesomeIcon className="text-3xl" icon={faFax} />
                <h1 className="font-inter text-lg font-semibold">FAX</h1>
                <p>011 3631245</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
