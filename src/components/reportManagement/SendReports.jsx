import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { set, ref, onValue } from "firebase/database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

function Payment() {
  const [userData, setUserData] = useState([]);
  const [repTypeData, setRepTypeData] = useState([]);
  const [reportType, setReportType] = useState("");
  const [userName, setUserName] = useState("");

  const [showAddedSuccessModal, setShowAddedSuccessModal] = useState(false);
  const [showAddedUnsuccessModal, setShowAddedUnsuccessModal] = useState(false);

  const [mVal1, setMVal1] = useState("");
  const [mVal2, setMVal2] = useState("");
  const [mVal3, setMVal3] = useState("");
  const [mVal4, setMVal4] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  //error states
  const [mVal1Error, setMVal1Error] = useState(null);
  const [mVal2Error, setMVal2Error] = useState(null);
  const [mVal3Error, setMVal3Error] = useState(null);
  const [mVal4Error, setMVal4Error] = useState(null);

  // useEffect hook to fetch data from Firebase
  useEffect(() => {
    //for user
    const userRef = ref(db, "users");
    onValue(userRef, (snapshot) => {
      const userData = [];
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        userData.push(user);
      });
      setUserData(userData);
    });

    //for report-type
    const repTypeRef = ref(db, "reportTypes");
    onValue(repTypeRef, (snapshot) => {
      const repTypeData = [];
      snapshot.forEach((childSnapshot) => {
        const repType = childSnapshot.val();
        repTypeData.push(repType);
      });
      setRepTypeData(repTypeData);
    });
  }, []);

  //write
  const writeToDatabase = () => {
    //validation checks
    let isValid = true;
    // Get the current date and time
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0]; // Get date as a string
    const currentTimeString = currentDate.toTimeString().split(' ')[0]; // Get time as a string

    if (!mVal1) {
      setMVal1Error("Value_1 is required");
      isValid = false;
    }
    if (!mVal2) {
      setMVal2Error("Value_2 is required");
      isValid = false;
    }

    if (!mVal3) {
      setMVal3Error("Value_3 is required");
      isValid = false;
    }
    if (!mVal4) {
      setMVal4Error("Value_4 is required");
      isValid = false;
    }

    if (!isValid) {
      setShowAddedUnsuccessModal(true);
      return; //not proceed if there are validation errors
    } else {
      try {
        setLoading(true); // Set loading state to true
        // Writing data to the Firebase
        const userReportData = {
          reportType,
          userName,
          mVal1,
          mVal2,
          mVal3,
          mVal4,
          note,
          Date: currentDateString,
          time: currentTimeString
        };

        set(ref(db, `userReports/${userName}_${reportType}_${currentDateString}_${currentTimeString}`), userReportData);
        setLoading(false);
        setShowAddedSuccessModal(true);
      } catch (error) {
        setShowAddedUnsuccessModal(true);
        console.log("Error sending reports to ", userName, ":", error);
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col w-full h-full">
        <div className="flex items-center w-full h-1/6 border-b p-3 border-ternary-blue dark:border-dark-ternary">
          <div className="flex h-full w-full">
            <div className="flex h-full w-1/2">
              <div className="flex items-center justify-center p-2 font-inter font-medium h-full w-1/3 text-ternary-blue dark:text-gray2">
                Report type
              </div>
              <div className="h-full w-2/3">
                <div className="h-full w-full p-2">
                  <select
                    className="bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary w-full h-full rounded-full text-white dark:text-gray1 border-2 pl-5 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1"
                    value={reportType}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      setReportType(
                        selectedValue === "Select the Report type"
                          ? null
                          : selectedValue
                      );
                    }}
                  >
                    <option className="text-primary-blue dark:text-gray1">
                      Select the Report type
                    </option>
                    {repTypeData.map((repType, index) =>
                      repType.activeStatus ? (
                        <option
                          className="text-primary-blue dark:text-gray1"
                          key={index}
                          value={repType.typeName}
                        >
                          {repType.typeName}
                        </option>
                      ) : null
                    )}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex h-full w-1/2">
              <div className="flex items-center justify-center p-2 font-inter font-medium h-full w-1/3 text-ternary-blue dark:text-gray2">
                Username
              </div>
              <div className="h-full w-2/3">
                <div className="h-full w-full p-2">
                  <select
                    className="bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary w-full h-full rounded-full text-white dark:text-gray1 border-2 pl-5 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1"
                    value={userName}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      setUserName(
                        selectedValue === "Select the User"
                          ? null
                          : selectedValue
                      );
                    }}
                  >
                    <option className="text-primary-blue dark:text-gray1">
                      Select the User
                    </option>
                    {userData.map((userName, index) =>
                      !userName.blocked ? (
                        <option
                          className="text-primary-blue dark:text-gray1"
                          key={index}
                          value={userName.userName}
                        >
                          {userName.userName}
                        </option>
                      ) : null
                    )}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-5/6 max-h-[450px] overflow-y-auto p-3 rounded">
          <div className="flex w-full h-2/5">
            <div className="h-full w-1/2">
              {repTypeData.map((repType, index) =>
                repType.typeName === reportType && userName ? (
                  <div
                    className="w-full h-full p-1 text-ternary-blue dark:text-gray1"
                    key={index}
                  >
                    {/* metric 1 */}
                    <div className="flex w-full h-1/2">
                      {repType.metric1 ? (
                        <>
                          <div className="flex items-center justify-left h-full w-1/3">
                            <p className="font-semibold">{repType.metric1}</p>
                          </div>
                          <div className="flex items-center justify-center h-full w-2/3">
                            <input
                              type={`${repType.metricVal1}`}
                              placeholder={`Enter the ${repType.metric1}`}
                              className={`${
                                mVal1Error !== ""
                                  ? "bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary"
                                  : "border-white bg-red-2 text-white"
                              } w-full h-2/3 rounded-full text-white dark:text-gray1 border-secondary-blue border-2 pl-3 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1`}
                              value={mVal1}
                              onChange={(e) => setMVal1(e.target.value)}
                            />
                          </div>
                        </>
                      ) : (
                        setMVal1("Zero")
                      )}
                    </div>
                    {/* metric 3 */}
                    <div className="flex w-full h-1/2">
                      {repType.metric3 ? (
                        <>
                          <div className="flex items-center justify-left h-full w-1/3">
                            <p className="font-semibold">{repType.metric3}</p>
                          </div>
                          <div className="flex items-center justify-center h-full w-2/3">
                            <input
                              type={`${repType.metricVal3}`}
                              placeholder={`Enter the ${repType.metric3}`}
                              className={`${
                                mVal3Error !== ""
                                  ? "bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary"
                                  : "border-white bg-red-2 text-white"
                              } w-full h-2/3 rounded-full text-white dark:text-gray1 border-secondary-blue border-2 pl-3 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1`}
                              value={mVal3}
                              onChange={(e) => setMVal3(e.target.value)}
                            />
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                ) : null
              )}
            </div>
            <div className="h-full w-1/2">
              {repTypeData.map((repType, index) =>
                repType.typeName === reportType && userName ? (
                  <div
                    className="w-full h-full p-1 text-ternary-blue dark:text-gray1"
                    key={index}
                  >
                    {/* metric 2 */}
                    <div className="flex w-full h-1/2">
                      {repType.metric2 ? (
                        <>
                          <div className="flex items-center justify-left h-full w-1/3">
                            <p className="font-semibold">{repType.metric2}</p>
                          </div>
                          <div className="flex items-center justify-center h-full w-2/3">
                            <input
                              type={`${repType.metricVal2}`}
                              placeholder={`Enter the ${repType.metric2}`}
                              className={`${
                                mVal2Error !== ""
                                  ? "bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary"
                                  : "border-white bg-red-2 text-white"
                              } w-full h-2/3 rounded-full text-white dark:text-gray1 border-secondary-blue border-2 pl-3 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1`}
                              value={mVal2}
                              onChange={(e) => setMVal2(e.target.value)}
                            />
                          </div>
                        </>
                      ) : null}
                    </div>
                    {/* metric 4 */}
                    <div className="flex w-full h-1/2">
                      {repType.metric4 ? (
                        <>
                          <div className="flex items-center justify-left h-full w-1/3">
                            <p className="font-semibold">{repType.metric4}</p>
                          </div>
                          <div className="flex items-center justify-center h-full w-2/3">
                            <input
                              type={`${repType.metricVal4}`}
                              placeholder={`Enter the ${repType.metric4}`}
                              className={`${
                                mVal4Error !== ""
                                  ? "bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary"
                                  : "border-white bg-red-2 text-white"
                              } w-full h-2/3 rounded-full text-white dark:text-gray1 border-secondary-blue border-2 pl-3 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1`}
                              value={mVal4}
                              onChange={(e) => setMVal4(e.target.value)}
                            />
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
          <div className="w-full h-3/5 p-1">
            {reportType && userName ? (
              <div className="h-full w-full">
                <div className="w-full h-3/4 pt-2 pb-2">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add Notes..."
                    className="h-full w-full rounded p-2 bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary text-white dark:text-gray1 border-2 pl-5 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1"
                  ></textarea>
                </div>
                <div className="flex items-center justify-end w-full h-1/4">
                  <div className="h-full w-auto p-1 flex items-center justify-center">
                    <button
                      onClick={writeToDatabase}
                      className="p-2 bg-secondary-blue hover:opacity-90 dark:bg-dark-ternary h-full w-full rounded-md text-xl shadow-xl text-white"
                    >
                      Send Reports
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center h-full w-full text-ternary-blue dark:text-gray1">
                Select a Report type and a User to send a report
              </div>
            )}
          </div>
        </div>
      </div>

      {/**Success notification modal */}
      {showAddedSuccessModal ? (
        <div>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-white">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="p-5 rounded-lg shadow-lg relative flex flex-col w-full bg-green border-2 outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-2 rounded-t">
                  <h3 className="text-sm">Notification</h3>
                  <button
                    className="ml-auto bg-red rounded-sm border-0 text-lg font-semibold drop-shadow-md active:bg-white"
                    onClick={() => setShowAddedSuccessModal(false)}
                  >
                    <span className=" drop-shadow-lg shadow-black h-6 w-6 text-white flex items-center justify-center active:text-dark-ternary">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex flex-col">
                  <h3 className="text-2xl font-semibold">
                    Report send Successfull! 😎
                  </h3>
                </div>
                {/*footer*/}
              </div>
            </div>
          </div>
          <div className="rounded-lg opacity-50 fixed inset-0 z-40 bg-black"></div>
        </div>
      ) : null}

      {/**Unsuccess notification modal */}
      {showAddedUnsuccessModal ? (
        <div>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-white">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="p-5 rounded-lg shadow-lg relative flex flex-col w-full bg-red border-2 outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-2 rounded-t">
                  <h3 className="text-sm">Notification</h3>
                  <button
                    className="ml-auto bg-red-1 rounded-sm border-0 text-lg font-semibold drop-shadow-md active:bg-white"
                    onClick={() => setShowAddedUnsuccessModal(false)}
                  >
                    <span className=" drop-shadow-lg shadow-black h-6 w-6 text-white flex items-center justify-center active:text-dark-ternary">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex flex-col">
                  <h3 className="text-center text-2xl font-semibold">
                    Report Send Unsuccessfull! 😢
                  </h3>
                  {mVal1Error && (
                    <p className="h-1/6 pt-1 text-xs text-center text-white">
                      - {mVal1Error} -
                    </p>
                  )}
                  {mVal2Error && (
                    <p className="h-1/6 pt-1 text-xs text-center text-white">
                      - {mVal2Error} -
                    </p>
                  )}
                  {mVal3Error && (
                    <p className="h-1/6 pt-1 text-xs text-center text-white">
                      - {mVal3Error} -
                    </p>
                  )}
                  {mVal4Error && (
                    <p className="h-1/6 pt-1 text-xs text-center text-white">
                      - {mVal4Error} -
                    </p>
                  )}
                </div>
                {/*footer*/}
              </div>
            </div>
          </div>
          <div className="rounded-lg opacity-50 fixed inset-0 z-40 bg-black"></div>
        </div>
      ) : null}

      {loading ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-primary-blue dark:text-white">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary-blue dark:border-white"></div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

export default Payment;
