import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase";
import { update, remove, ref, onValue } from "firebase/database";
import { ref as storageRef, deleteObject } from "firebase/storage";
import NotificationModal from "../Modal/NotificationModal";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import UserPaymentTable from "../tables/UserPaymentTable";
import DownloadBtn from "../tables/sampleTable/DownloadBtn";
import DebouncedInput from "../tables/sampleTable/DebouncedInput";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faPhoneVolume,
  faLocationDot,
  faEnvelope,
  faRuler,
  faWeightScale,
} from "@fortawesome/free-solid-svg-icons";

function Payment() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [userData, setUserData] = useState([]);
  const [repTypeData, setRepTypeData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reportType, setReportType] = useState("");
  const [userName, setUserName] = useState("");

  const [showUserUpdateSuccessModal, setShowUserUpdateSuccessModal] =
    useState(false);
  const [showUserUpdateUnsuccessModal, setShowUserUpdateUnsuccessModal] =
    useState(false);
  const [showUserRemoveSuccessModal, setShowUserRemoveSuccessModal] =
    useState(false);
  const [showUserRemoveUnsuccessModal, setShowUserRemoveUnsuccessModal] =
    useState(false);
  const [showUserBlockedModal, setShowUserBlockedModal] = useState(false);
  const [showUserUnblockedModal, setShowUserUnblockedModal] = useState(false);

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
                      setReportType(e.target.value);
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
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full h-5/6 max-h-[450px] overflow-y-auto p-3 rounded"></div>
      </div>
      {/**Edit modal */}
      {showEditModal ? (
        <div>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-primary-blue dark:text-white">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="p-2 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-ternary-blue dark:bg-dark-secondary dark:border-2 dark:border-dark-ternary outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-1 rounded-t">
                  <h3 className="text-xl font-semibold">Edit Lab</h3>
                  <button
                    className=" ml-auto  border-0 text-primary-blue font-semibold active:text-black"
                    onClick={() => setShowEditModal(false)}
                  >
                    <span className=" text-primary-blue drop-shadow-lg shadow-black h-6 w-6 text-3xl block dark:text-white flex items-center justify-center">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-2 flex flex-col">
                  <form>
                    <div className="h-1/5 w-full flex flex-col">
                      <div className="">
                        <p className="font-semibold">User Name :</p>
                      </div>
                      <div className="pt-2 pb-2">
                        <input
                          type="text"
                          placeholder="Enter new Lab name"
                          className="rounded-full p-2 h-3/5 w-full bg-white border-primary-blue border-2 text-center font-semibold dark:border-dark-ternary dark:bg-dark-ternary active:bg-secondary-blue dark:active:bg-dark-secondary"
                          value={selectedUser.userName}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              userName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="h-1/5 w-full flex flex-col">
                      <div>
                        <p className="font-semibold">Address :</p>
                      </div>
                      <div className="pt-2 pb-2">
                        <input
                          type="text"
                          placeholder="Enter new Address"
                          className="rounded-full p-2 h-3/5 w-full bg-white border-primary-blue border-2 text-center font-semibold dark:border-dark-ternary dark:bg-dark-ternary active:bg-secondary-blue dark:active:bg-dark-secondary"
                          value={selectedUser.address}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="h-1/5 w-full flex flex-col">
                      <div>
                        <p className="font-semibold">District :</p>
                      </div>
                      <div className="pt-2 pb-2">
                        <input
                          type="text"
                          placeholder="Enter new E-mail"
                          className="rounded-full p-2 h-3/5 w-full bg-white border-primary-blue border-2 text-center font-semibold dark:border-dark-ternary dark:bg-dark-ternary active:bg-secondary-blue dark:active:bg-dark-secondary"
                          value={selectedUser.district}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              district: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="h-1/5 w-full flex flex-col">
                      <div>
                        <p className="font-semibold">Telephone :</p>
                      </div>
                      <div className="pt-2 pb-2">
                        <input
                          type="text"
                          placeholder="Enter new Telephone"
                          className="rounded-full p-2 h-3/5 w-full bg-white border-primary-blue border-2 text-center font-semibold dark:border-dark-ternary dark:bg-dark-ternary active:bg-secondary-blue dark:active:bg-dark-secondary"
                          value={selectedUser.telephone}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              telephone: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </form>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-center p-1 rounded-b">
                  <button
                    className="bg-primary-blue text-white active:bg-black font-bold uppercase text-md px-3 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 dark:bg-dark-primary"
                    type="button"
                    onClick={updateUserData}
                  >
                    <FontAwesomeIcon icon={faFloppyDisk} />
                    &nbsp; Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg opacity-50 fixed inset-0 z-40 bg-black"></div>
        </div>
      ) : null}

      {/**view modal */}
      {showViewModal ? (
        <div>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-primary-blue dark:text-white">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="p-2 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-ternary-blue dark:bg-dark-secondary dark:border-2 dark:border-dark-ternary outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-1 rounded-t">
                  <h3 className="text-xl font-semibold">User Info</h3>
                  <button
                    className=" ml-auto  border-0 text-primary-blue font-semibold active:text-black"
                    onClick={() => setShowViewModal(false)}
                  >
                    <span className=" text-primary-blue drop-shadow-lg shadow-black h-6 w-6 text-3xl block dark:text-white flex items-center justify-center">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="w-full h-full p-3">
                  <div className="flex p-1">
                    <div className="h-full w-1/2 p-2">
                      <div className="flex items-center justify-center ">
                        <img
                          className="rounded-full border-4 border-white drop-shadow-lg w-1/2 h-1/2 object-cover"
                          src={selectedUser.proPic}
                          alt="proPic"
                        />
                      </div>
                      <p className="h-1/2 w-full font-md p-2  text-center font-inter font-semibold text-2xl">
                        {selectedUser.userName}
                      </p>
                    </div>
                    <div className="h-full w-1/2 p-2 font-inter">
                      <div className="w-full h-1/2 text-sm">
                        <p className="font-bold text-lg pb-3">
                          Contact Details:
                        </p>
                        <p className="h-full w-full">
                          <FontAwesomeIcon icon={faPhoneVolume} />
                          &nbsp;&nbsp;&nbsp;{selectedUser.telephone}
                        </p>
                        <p className="h-full w-full">
                          <FontAwesomeIcon icon={faEnvelope} />
                          &nbsp;&nbsp;&nbsp;{selectedUser.email}
                        </p>
                        <p className="h-full w-full">
                          <FontAwesomeIcon icon={faLocationDot} />
                          &nbsp;&nbsp;&nbsp;{selectedUser.address},&nbsp;
                          {selectedUser.district},&nbsp;{selectedUser.province}{" "}
                          province,&nbsp;Sri Lanka.
                        </p>
                      </div>
                      <p>&nbsp;</p>
                      <div className="w-full h-1/2 text-sm">
                        <p className="font-bold text-lg pb-3">
                          Biometric Details:
                        </p>
                        <p className="h-full w-full">
                          <FontAwesomeIcon icon={faRuler} />
                          &nbsp;&nbsp;&nbsp;100cm
                        </p>
                        <p className="h-full w-full">
                          <FontAwesomeIcon icon={faWeightScale} />
                          &nbsp;&nbsp;&nbsp;10Kg
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg opacity-50 fixed inset-0 z-40 bg-black"></div>
        </div>
      ) : null}

      {/**User update success modal */}
      {showUserUpdateSuccessModal ? (
        <NotificationModal
          show={showUserUpdateSuccessModal}
          onClose={() => {
            setShowUserUpdateSuccessModal(false);
          }}
          title="Notification"
          body="User Updated Successfull! 😎"
          color="green"
        />
      ) : null}

      {/**User update Unsuccess modal */}
      {showUserUpdateSuccessModal ? (
        <NotificationModal
          show={showUserUpdateUnsuccessModal}
          onClose={() => {
            setShowUserUpdateUnsuccessModal(false);
          }}
          title="Notification"
          body="User Updated Unsuccessfull! 😥"
          color="red"
        />
      ) : null}

      {/**User remove success modal */}
      {showUserRemoveSuccessModal ? (
        <NotificationModal
          show={showUserRemoveSuccessModal}
          onClose={() => {
            setShowUserRemoveSuccessModal(false);
          }}
          title="Notification"
          body="User Removed! 🤔"
          color="red"
        />
      ) : null}

      {/**User remove unsuccess modal */}
      {showUserRemoveUnsuccessModal ? (
        <NotificationModal
          show={showUserRemoveUnsuccessModal}
          onClose={() => {
            setShowUserRemoveUnsuccessModal(false);
          }}
          title="Notification"
          body="User Removal Unsuccessfull! 🤗"
          color="red"
        />
      ) : null}

      {/**User blocked success modal */}
      {showUserBlockedModal ? (
        <NotificationModal
          show={showUserBlockedModal}
          onClose={() => {
            setShowUserBlockedModal(false);
          }}
          title="Notification"
          body="User Blocked! 🤔"
          color="yellow"
        />
      ) : null}

      {/**User unblocked success modal */}
      {showUserUnblockedModal ? (
        <NotificationModal
          show={showUserUnblockedModal}
          onClose={() => {
            setShowUserUnblockedModal(false);
          }}
          title="Notification"
          body="User UnBlocked! 🤗"
          color="green"
        />
      ) : null}
    </>
  );
}

export default Payment;
