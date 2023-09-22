import { React, useState, useEffect } from "react";
import { db } from "../../firebase";
import { update, remove, ref, onValue } from "firebase/database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import NotificationModal from "../Modal/NotificationModal";

function UserManageTable() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [userData, setUserData] = useState([]); // State to store retrieved data
  const [selectedUser, setSelectedUser] = useState({
    uuid: "",
    userName: "",
    address: "",
    district: "",
    email: "",
    password: "",
    province: "",
    telephone: "",
    type: "",
    proPic: "",
    blocked: "",
  });

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
    const userRef = ref(db, `users/${selectedUser.uuid}`);
    const updates = {
      UserName: selectedUser.userName,
      address: selectedUser.address,
      telephone: selectedUser.telephone,
      email: selectedUser.email,
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

  //Remove a lab
  const removeUser = (slectedUser) => {
    console.log("selectedUser:", slectedUser); // Check the selectedLab object

    const userRef = ref(db, "users/" + slectedUser);

    // Remove the lab from Firebase
    remove(userRef)
      .then(() => {
        setShowUserRemoveSuccessModal(true);
      })
      .catch((error) => {
        console.error("Error removing user:", error);
        setShowUserRemoveUnsuccessModal(true);
      });
  };

  const handleToggleBlock = (index) => {
    const selectedUser = userData[index]; // Get the selected lab data
    const userRef = ref(db, `users/${selectedUser.uuid}`);

    // Update the blocked status of the user in Firebase
    const updatedBlockedStatus = !selectedUser.blocked;
    const updates = {
      blocked: updatedBlockedStatus,
    };

    // Update the data in Firebase
    update(userRef, updates)
      .then(() => {
        // Data updated successfully
        console.log("User blocked/unblocked!");
      })
      .catch((error) => {
        console.error("Error blocking user:", error);
      });

    const updatedUserData = [...userData]; // Create a copy of the userData array
    updatedUserData[index].blocked = updatedBlockedStatus; // Update the blocked status in the copied array
    setUserData(updatedUserData); // Update the userData state
  };

  return (
    <>
      <div className="flex items-center justify-center overflow-hidden w-full h-full">
        <div className="w-11/12 h-5/6 overflow-y-auto overflow-x-auto shadow-md rounded">
          <table className=" h-full w-full text-sm text-center  text-primary-blue dark:text-white">
            <thead className="text-xs text-white  uppercase bg-secondary-blue dark:bg-black dark:text-dark-ternary">
              <tr>
                <th scope="col" className="px-6 py-3">
                  USER NAME
                </th>
                <th scope="col" className="px-6 py-3">
                  ADDRESS
                </th>
                <th scope="col" className="px-6 py-3">
                  TELEPHONE
                </th>
                <th scope="col" className="px-6 py-3">
                  EMAIL
                </th>
                <th scope="col" className="px-6 py-3">
                  PROFILE PICTURE
                </th>
                <th scope="col" className="px-6 py-3">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="bg-ternary-blue h-full w-full dark:bg-dark-ternary">
            {userData.map((user, index) => (
                <tr key={index} className="border-b">
                  <td className="px-6 py-4">{user.userName}</td>
                  <td className="px-6 py-4">{user.address}</td>
                  <td className="px-6 py-4">{user.telephone}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={user.proPic}
                      alt="proPic"
                    />
                  </td>
                  <td className="px-6 py-4 space-x-2 flex">
                    <button
                      className="bg-blue text-white p-1 rounded shadow-lg hover:opacity-80"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowEditModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className={`${
                        user.blocked ? "bg-green text-white" : "bg-yellow"
                      } text-black p-1 rounded shadow-lg hover:opacity-80`}
                      onClick={() => {
                        handleToggleBlock(index);
                        user.blocked
                          ? setShowUserBlockedModal(true)
                          : setShowUserUnblockedModal(true);
                      }}
                    >
                      {user.blocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      className="bg-red text-white p-1 rounded shadow-lg hover:opacity-80"
                      onClick={() => {
                        removeUser(user.uuid);
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/**Edit lab modal */}
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
                    <div className="h-1/5 w-full flex flex-col">
                      <div>
                        <p className="font-semibold">Email :</p>
                      </div>
                      <div className="pt-2 pb-2">
                        <input
                          type="email"
                          placeholder="Enter new E-mail"
                          className="rounded-full p-2 h-3/5 w-full bg-white border-primary-blue border-2 text-center font-semibold dark:border-dark-ternary dark:bg-dark-ternary active:bg-secondary-blue dark:active:bg-dark-secondary"
                          value={selectedUser.email}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              email: e.target.value,
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

      
      <div className="bg-green h-full w-full rounded overflow-x-auto">
      <table ref={tableRef} className="border border-ternary-blue w-full h-full text-left dark:border-gray2">
        <thead className="bg-ternary-blue text-primary-blue dark:bg-dark-primary dark:text-gray2" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
          {tableName.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="capitalize px-3.5 py-2">
                  {header.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="text-ternary-blue bg-primary-blue dark:bg-dark-ternary dark:text-gray1">
          {tableName.getRowModel().rows.length ? (
            tableName.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                className={`
                  ${i % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                  `}
              >
                {row.cells.map((cell) => (
                  <td key={cell.column.id} className="px-3.5 py-2">
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr className="text-center h-32">
              <td colSpan={12}>No Record Found!</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </>
  );
}

export default UserManageTable;
