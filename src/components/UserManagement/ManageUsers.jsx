import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase";
import { update, remove, ref, onValue } from "firebase/database";
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";
import NotificationModal from "../Modal/NotificationModal";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import UManageTable from "../tables/UManageTable";
import DownloadBtn from "../tables/sampleTable/DownloadBtn";
import DebouncedInput from "../tables/sampleTable/DebouncedInput";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faFloppyDisk,
  faPhoneVolume,
  faLocationDot,
  faEnvelope,
  faRuler,
  faWeightScale,
} from "@fortawesome/free-solid-svg-icons";

function ManageUsers() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [userData, setUserData] = useState([]); // State to store retrieved data
  const [selectedUser, setSelectedUser] = useState(null);

  const [showUserUpdateSuccessModal, setShowUserUpdateSuccessModal] =
    useState(false);
  const [showUserUpdateUnsuccessModal, setShowUserUpdateUnsuccessModal] =
    useState(false);
  const [showUserRemoveSuccessModal, setShowUserRemoveSuccessModal] =
    useState(false);
  const [showUserRemoveUnsuccessModal, setShowUserRemoveUnsuccessModal] =
    useState(false);
  const [blockedStatus, setBlockedStatus] = useState(
    userData.map(() => false) // Initialize with all labs as unblocked
  );
  const [showUserBlockedModal, setShowUserBlockedModal] = useState(false);
  const [showUserUnblockedModal, setShowUserUnblockedModal] = useState(false);

  // useEffect hook to fetch data from Firebase
  useEffect(() => {
    const userRef = ref(db, "users");
    onValue(userRef, (snapshot) => {
      const userData = [];
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        userData.push(user);
      });
      setUserData(userData);
    });
  }, []);

  // user update function
  const updateUserData = () => {
    const userRef = ref(db, `users/${selectedUser.uid}`);
    const updates = {
      userName: selectedUser.userName,
      telephone: selectedUser.telephone,
      address: selectedUser.address,
      district: selectedUser.district,
    };

    // Update the data in Firebase realtime
    update(userRef, updates)
      .then(() => {
        // Data updated successfully
        console.log("User data updated!");
        setShowEditModal(false); // Close the Edit modal
        setShowUserUpdateSuccessModal(true);
      })
      .catch((error) => {
        console.error("Error updating User data:", error);
        setShowUserUpdateUnsuccessModal(true);
      });
  };

  //Function to hadle remove button
  const handleRemoveClick = (user) => {
    const userRef = ref(db, "users/" + user.uid);
    const imagePath = user.proPic;
    const imageRef = storageRef(storage, imagePath);

    // Remove the user's profile picture from Firebase Storage
    deleteObject(imageRef)
      .then(() => {
        // Image deleted successfully from Firebase Storage
        console.log(user.userName,"'s proPic deleted from Firebase Storage");
      })
      .catch((error) => {
        console.error("Error deleting proPic from Firebase Storage:", error);
      });

    // Remove the user from Firebase database
    remove(userRef)
      .then(() => {
        setShowUserRemoveSuccessModal(true);
      })
      .catch((error) => {
        console.error("Error removing user:", error);
        setShowUserRemoveUnsuccessModal(true);
      });
  };

  //Function to handle view button
  const handleViewClick = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  // Function to handle edit button
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  // Function to handle block/unblock button
  const handleToggleBlock = (user) => {
    //setShowClickAgainModal(true);
    const userRef = ref(db, `users/${user.uid}`);
    // Update the blocked status of the user in Firebase
    const updatedBlockedStatus = !user.blocked;
    const updates = {
      blocked: updatedBlockedStatus,
    };

    // Update the data in Firebase
    update(userRef, updates)
      .then(() => {
        // Data updated successfully
        console.log(
          "User statues:",
          user.userName,
          updatedBlockedStatus ? "Blocked" : "Unblocked"
        );
        //showing blocked modal success or not
        updatedBlockedStatus
          ? setShowUserBlockedModal(true)
          : setShowUserUnblockedModal(true);
      })
      .catch((error) => {
        console.error("Error blocking user:", error);
      });
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("", {
      id: "U.No",
      cell: (info) => <span>{info.row.index + 1}</span>,
      header: "U.No",
    }),
    columnHelper.accessor("proPic", {
      cell: (info) => (
        <img
          src={info?.getValue()}
          alt="proPic"
          className="rounded-full border w-10 h-10 object-cover"
        />
      ),
      header: "Profile Pic",
    }),
    columnHelper.accessor("userName", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Name",
    }),
    columnHelper.accessor("telephone", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Telephone",
    }),
    columnHelper.accessor("address", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Address",
    }),
    columnHelper.accessor("district", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "District",
    }),
    columnHelper.accessor("", {
      header: "Action",
      cell: (info) => (
        <div className="flex items-center">
          <button
            className="bg-blue text-white active:bg-black font-semibold uppercase text-sm px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            onClick={() => handleEditClick(info.row.original)}
          >
            Edit
          </button>
          <button
            className={`bg-${
              info.row.original.blocked ? "green" : "yellow"
            } text-white active:bg-black font-semibold uppercase text-sm px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
            onClick={() => handleToggleBlock(info.row.original)}
          >
            {info.row.original.blocked ? "Unblock" : "Block"}
          </button>

          <button
            className="bg-white text-blue border active:bg-black font-semibold uppercase text-sm px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            onClick={() => handleViewClick(info.row.original)}
          >
            View
          </button>
          <button
            className="bg-red-2 text-white active:bg-black font-semibold uppercase text-sm px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            onClick={() => handleRemoveClick(info.row.original)}
          >
            Remove
          </button>
        </div>
      ),
    }),
  ];
  const [data] = useState(() => [...userData]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: userData,
    columns,
    state: {
      globalFilter,
    },
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <div className="flex flex-col w-full h-full">
        <div className="flex items-center w-full h-1/6 border-b border-ternary-blue dark:border-dark-ternary">
          <div className="flex justify-start items-center h-full w-1/2 p-3">
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Search all columns..."
            />
          </div>
          <div className="flex items-center justify-end h-full w-1/2 p-3">
            <DownloadBtn data={data} fileName={"users"} />
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <button className="p-2 border border-ternary-blue font-inter bg-primary-blue text-ternary-blue text-lg rounded shadow-md hover:shadow-lg hover:text-white hover:border-white dark:bg-black dark:bg-opacity-50 dark:text-gray2 dark:border-gray2 dark:shadow-black dark:hover:text-gray1 dark:hover:border-gray1">
              <FontAwesomeIcon icon={faUserPlus} />
              &nbsp;&nbsp;Add New User
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center w-full h-4/6 max-h-[450px] overflow-y-auto p-3 rounded">
          <UManageTable tableName={table} />
        </div>
        <div className="flex items-center justify-center w-full h-1/6 p-3 border-t border-ternary-blue dark:border-dark-ternary">
          {/* pagination */}
          <div className="flex items-center justify-end mt-2 gap-2 text-ternary-blue dark:text-gray2">
            <button
              onClick={() => {
                table.previousPage();
              }}
              disabled={!table.getCanPreviousPage()}
              className="p-1 border border-gray-300 px-2 disabled:opacity-30"
            >
              {"<"}
            </button>
            <button
              onClick={() => {
                table.nextPage();
              }}
              disabled={!table.getCanNextPage()}
              className="p-1 border border-gray-300 px-2 disabled:opacity-30"
            >
              {">"}
            </button>

            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
            <span className="flex items-center gap-1">
              | Go to page:
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="border p-1 rounded w-16 bg-transparent"
              />
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="p-2 bg-transparent"
            >
              {[10, 20, 30, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
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
                          {selectedUser.district},&nbsp;Sri Lanka.
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

export default ManageUsers;
