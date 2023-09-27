import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase";
import { update, remove, ref, onValue } from "firebase/database";
import { ref as storageRef, deleteObject } from "firebase/storage";
import NotificationModal from "../Modal/NotificationModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

function Payment() {
  const [showInitiatingModal, setShowInitiatingModal] = useState(false);
  const [userData, setUserData] = useState([]);
  const [repTypeData, setRepTypeData] = useState([]);
  const [reportType, setReportType] = useState(null);
  const [userName, setUserName] = useState(null);

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

  const handleNextBtn = () => {
    setShowInitiatingModal(false);
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
                    {repTypeData.map((repType, index) => (
                      <option
                        className="text-primary-blue dark:text-gray1"
                        key={index}
                        value={repType.typeName}
                      >
                        {repType.typeName}
                      </option>
                    ))}
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
                    {userData.map((userName, index) => (
                      <option
                        className="text-primary-blue dark:text-gray1"
                        key={index}
                        value={userName.userName}
                      >
                        {userName.userName}
                      </option>
                    ))}
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
                              className="bg-ternary-blue bg-opacity-30 p-2 h-3/5 w-full border-white dark:border-gray2 dark:bg-dark-ternary rounded-full text-white dark:text-gray1 border-2 pl-5 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1"
                              // value={selectedReportType.metricVal2}
                              // onChange={(e) =>
                              //   setSelectedReportType({
                              //     ...selectedReportType,
                              //     metricVal2: e.target.value,
                              //   })
                              // }
                            />
                          </div>
                        </>
                      ) : null}
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
                              className="bg-ternary-blue bg-opacity-30 p-2 h-3/5 w-full border-white dark:border-gray2 dark:bg-dark-ternary rounded-full text-white dark:text-gray1 border-2 pl-5 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1"
                              // value={selectedReportType.metricVal2}
                              // onChange={(e) =>
                              //   setSelectedReportType({
                              //     ...selectedReportType,
                              //     metricVal2: e.target.value,
                              //   })
                              // }
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
                              className="bg-ternary-blue bg-opacity-30 p-2 h-3/5 w-full border-white dark:border-gray2 dark:bg-dark-ternary rounded-full text-white dark:text-gray1 border-2 pl-5 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1"
                              // value={selectedReportType.metricVal2}
                              // onChange={(e) =>
                              //   setSelectedReportType({
                              //     ...selectedReportType,
                              //     metricVal2: e.target.value,
                              //   })
                              // }
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
                              className="bg-ternary-blue bg-opacity-30 p-2 h-3/5 w-full border-white dark:border-gray2 dark:bg-dark-ternary rounded-full text-white dark:text-gray1 border-2 pl-5 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1"
                              // value={selectedReportType.metricVal2}
                              // onChange={(e) =>
                              //   setSelectedReportType({
                              //     ...selectedReportType,
                              //     metricVal2: e.target.value,
                              //   })
                              // }
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
                    placeholder="Add Notes..."
                    className="h-full w-full rounded p-2 bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary text-white dark:text-gray1 border-2 pl-5 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1"
                  ></textarea>
                </div>
                <div className="flex items-center justify-end w-full h-1/4">
                  <div className="h-full w-auto p-1 flex items-center justify-center">
                    <button className="p-2 bg-secondary-blue hover:opacity-90 dark:bg-dark-ternary h-full w-full rounded-md text-xl shadow-xl text-white">
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
      {/**initiating modal */}
      {showInitiatingModal ? (
        <div>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-primary-blue dark:text-white">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="p-2 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-ternary-blue dark:bg-dark-secondary dark:border-2 dark:border-dark-ternary outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-1 rounded-t">
                  <h3 className="text-xl font-semibold">Send Reports</h3>
                  <button
                    className=" ml-auto  border-0 text-primary-blue font-semibold active:text-black"
                    onClick={() => setShowInitiatingModal(false)}
                  >
                    <span className=" text-primary-blue drop-shadow-lg shadow-black h-6 w-6 text-3xl block dark:text-white flex items-center justify-center">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-2">
                  <form>
                    <div className="h-1/2 w-full flex items-center">
                      <div className="flex items-center justify-left h-full w-1/2">
                        <p className="font-semibold">Select User :</p>
                      </div>
                      <div className="h-full w-1/2 p-1">
                        <select
                          className="bg-primary-blue bg-opacity-30 border-primary-blue dark:border-gray2 dark:bg-dark-ternary w-full h-full rounded-full text-primary-blue dark:text-gray1 border-2 pl-5 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1"
                          value={userName}
                          onChange={(e) => {
                            setUserName(e.target.value);
                          }}
                        >
                          {userData.map((userName, index) => (
                            <option
                              className="text-primary-blue dark:text-gray1"
                              key={index}
                              value={userName.userName}
                            >
                              {userName.userName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="h-1/2 w-full flex items-center">
                      <div className="flex items-center justify-left h-full w-1/2">
                        <p className="font-semibold">Select Report type :</p>
                      </div>
                      <div className="h-full w-1/2 p-1">
                        <select
                          className="bg-primary-blue bg-opacity-30 border-primary-blue dark:border-gray2 dark:bg-dark-ternary w-full h-full rounded-full text-primary-blue dark:text-gray1 border-2 pl-5 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1"
                          value={reportType}
                          onChange={(e) => {
                            setUserName(e.target.value);
                          }}
                        >
                          {repTypeData.map((typeName, index) => (
                            <option
                              className="text-primary-blue dark:text-gray1"
                              key={index}
                              value={typeName.typeName}
                            >
                              {typeName.typeName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </form>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-center p-1 rounded-b">
                  <button
                    className="bg-primary-blue text-white active:bg-black font-bold uppercase text-md px-3 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 dark:bg-dark-primary"
                    type="button"
                    onClick={handleNextBtn}
                  >
                    Next&nbsp;
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg opacity-50 fixed inset-0 z-40 bg-black"></div>
        </div>
      ) : null}
    </>
  );
}

export default Payment;
