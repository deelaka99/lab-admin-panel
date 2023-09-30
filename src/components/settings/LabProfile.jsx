import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { auth, db, storage } from "../../firebase";
import { ref as ref1, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateEmail } from "firebase/auth";
import { set, ref, onValue } from "firebase/database";
import NotificationModal from "../../components/Modal/NotificationModal";

function LabProfile() {
  const [showEditLabAdminModal, setShowEditLabAdminModal] = useState(false);
  const [showEditLabAdminSuccessModal, setShowEditLabAdminSuccessModal] =
    useState(false);
  const [showEditLabAdminUnsuccessModal, setShowEditLabAdminUnsuccessModal] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFilePath, setSelectedFilePath] = useState(null);
  const [currentLabAdminData, setCurrentLabAdminData] = useState({
    uuid: "",
    LabName: "",
    email: "",
    telephone: "",
    address: "",
    district: "",
    province: "",
    password: "",
    type: "",
    profilePicture: "",
  });

  const [updatedLabAdminData, setUpdatedLabAdminData] = useState({
    LabName: currentLabAdminData.LabName,
    email: currentLabAdminData.email,
    telephone: currentLabAdminData.telephone,
    address: currentLabAdminData.address,
  });

  useEffect(() => {
    // Fetch admin data from Realtime Database
    const labAdmin = auth.currentUser;
    if (labAdmin) {
      const labAdminRef = ref(db, `labs/${labAdmin.uid}`);
      onValue(labAdminRef, (snapshot) => {
        if (snapshot.exists()) {
          const labAdminDetails = snapshot.val();
          setCurrentLabAdminData(labAdminDetails);
          setUpdatedLabAdminData(labAdminDetails);
        }
      });
    }
  }, []);

  //handle input image file
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
      setSelectedFilePath(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setSelectedFilePath(null);
    }
  };

  const handleUpdateLabAdmin = async () => {
    try {
      setLoading(true); // Set loading state to true
      const user = auth.currentUser;

      // Update profile picture if selected
      if (selectedFile) {
        const storageRef = ref1(storage, "profilePictures/" + user.uid);
        await uploadBytes(storageRef, selectedFile);
        const downloadURL = await getDownloadURL(storageRef);
        updatedLabAdminData.profilePicture = downloadURL;
      }

      // Update Lab admin details in the Realtime Database
      await set(ref(db, `labs/${user.uid}`), updatedLabAdminData);

      // Close the modal after updating Lab admin
      setShowEditLabAdminModal(false);
      setShowEditLabAdminSuccessModal(true);
    } catch (error) {
      console.error("Error updating Lab admin:", error);
      setShowEditLabAdminUnsuccessModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full p-5">
      <div className="flex items-center justify-center w-full h-1/3 p-2">
        <div className="flex bg-primary-blue h-full w-full border border-white rounded-lg shadow-lg dark:bg-dark-primary dark:border-dark-ternary">
          <div className="flex items-center justify-center h-full w-2/5">
            <div className="w-32 h-32 rounded-full bg-primary-blue overflow-hidden flex items-center justify-center border-4 drop-shadow-lg border-ternary-blue dark:border-gray1">
              <img
                className="h-full w-full"
                src={
                  currentLabAdminData.profilePicture
                    ? `${currentLabAdminData.profilePicture}`
                    : "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=600"
                }
                alt="proPic"
              />
            </div>
          </div>
          <div className="h-full w-3/5 flex items-center">
            <div className="h-3/4 w-full flex items-center text-ternary-blue dark:text-gray2">
              <h1 className="text-4xl font-inter font-medium pr-5">
                {currentLabAdminData.LabName}
              </h1>
              <p>&nbsp;&nbsp;&nbsp;</p>
              <button
                className="flex items-center justify-center active:text-secondary-blue hover:shadow-lg dark:active:text-gray1"
                onClick={() => setShowEditLabAdminModal(true)}
              >
                <FontAwesomeIcon icon={faPencil} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-full h-2/3 p-2">
        <div className="bg-primary-blue h-full w-full font-inter text-ternary-blue border border-white rounded-lg shadow-lg dark:text-gray2 dark:bg-dark-primary dark:border-dark-ternary">
          <div className="flex items-center justify-center w-full h-1/6 p-2 font-bold border-b dark:border-dark-ternary">
            <h1>Lab Admin Details</h1>
          </div>
          <div className="w-full h-5/6 flex">
            <div className="h-full w-1/5">
              <div className="w-full h-1/3 pt-5 pl-5 pr-3 font-semibold">
                <h1 className="pt-5">Email Address</h1>
                <h1 className="pt-5">Phone number</h1>
                <h1 className="pt-5">Address</h1>
              </div>
            </div>
            <div className="h-full w-4/5 pt-5 pl-5 dark:text-gray1">
              <h1 className="pt-5">: {currentLabAdminData.email}</h1>
              <h1 className="pt-5">: {currentLabAdminData.telephone}</h1>
              <h1 className="pt-5">
                :{" "}
                {currentLabAdminData.address +
                  ", " +
                  currentLabAdminData.district +
                  ", " +
                  currentLabAdminData.province +
                  ", Sri Lanka."}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/**edit Lab admin modal */}
      {showEditLabAdminModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-primary-blue dark:text-white">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="p-5 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-ternary-blue dark:bg-dark-secondary dark:border-2 dark:border-dark-ternary outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-2 rounded-t">
                  <h3 className="text-xl font-semibold">Edit Profile</h3>
                  <button
                    className="p-1 ml-auto  border-0 text-primary-blue text-3xl font-semibold active:text-black"
                    onClick={() => setShowEditLabAdminModal(false)}
                  >
                    <span className=" text-primary-blue drop-shadow-lg shadow-black h-6 w-6 text-4xl dark:text-white flex items-center justify-center">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-2">
                  <form>
                    <div className="h-1/5 w-full flex items-center">
                      <div className="h-full w-1/3">
                        <p className="font-semibold">Lab name :</p>
                      </div>
                      <div className="h-full w-2/3 pl-2 pt-1 pb-1">
                        <input
                          type="text"
                          placeholder="Existing name"
                          value={updatedLabAdminData.LabName}
                          onChange={(e) =>
                            setUpdatedLabAdminData((prevData) => ({
                              ...prevData,
                              LabName: e.target.value,
                            }))
                          }
                          className="rounded-full p-2 w-full bg-white border-primary-blue border-2 text-center font-semibold dark:border-dark-ternary dark:bg-dark-ternary active:bg-secondary-blue dark:active:bg-dark-secondary"
                        />
                      </div>
                    </div>
                    <div className="h-1/5 w-full flex items-center">
                      <div className="h-full w-1/3">
                        <p className="font-semibold">Phone :</p>
                      </div>
                      <div className="h-full w-2/3 pl-2 pt-1 pb-1">
                        <input
                          type="text"
                          placeholder="Existing phone"
                          value={updatedLabAdminData.telephone}
                          onChange={(e) =>
                            setUpdatedLabAdminData((prevData) => ({
                              ...prevData,
                              telephone: e.target.value,
                            }))
                          }
                          className="rounded-full p-2 w-full bg-white border-primary-blue border-2 text-center font-semibold dark:border-dark-ternary dark:bg-dark-ternary active:bg-secondary-blue dark:active:bg-dark-secondary"
                        />
                      </div>
                    </div>
                    <div className="h-1/5 w-full flex items-center">
                      <div className="h-full w-1/3">
                        <p className="font-semibold">Address :</p>
                      </div>
                      <div className="h-full w-2/3 pl-2 pt-1 pb-1">
                        <input
                          type="text"
                          placeholder="Existing address"
                          value={updatedLabAdminData.address}
                          onChange={(e) =>
                            setUpdatedLabAdminData((prevData) => ({
                              ...prevData,
                              address: e.target.value,
                            }))
                          }
                          className="rounded-full p-2 w-full bg-white border-primary-blue border-2 text-center font-semibold dark:border-dark-ternary dark:bg-dark-ternary active:bg-secondary-blue dark:active:bg-dark-secondary"
                        />
                      </div>
                    </div>
                    <div className="h-1/5 w-full flex items-center justify-center p-3">
                      <label className="relative cursor-pointer bg-white text-primary-blue text-md font-lg font-inter py-2 px-3 rounded-full shadow-md hover:bg-white hover:shadow-lg dark:bg-dark-ternary dark:border-2 dark:border-dark-ternary dark:text-gray1">
                        <span>
                          {selectedFile ? (
                            <div className="flex h-full w-full">
                              <div className="flex items-center justify-center">
                                <img
                                  src={selectedFilePath}
                                  alt="Selected"
                                  className="w-7 h-7 rounded-full shadow-sm shadow-dark-primary"
                                />
                              </div>
                              <div className="flex items-center justify-center">
                                <span>
                                  &nbsp;&nbsp;&nbsp;Change Report
                                  Icon&nbsp;&nbsp;&nbsp;
                                  <FontAwesomeIcon icon={faCaretDown} />
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span>
                              Select Report Icon&nbsp;&nbsp;&nbsp;
                              <FontAwesomeIcon icon={faCaretDown} />
                            </span>
                          )}
                        </span>
                        <input
                          type="file"
                          accept=".jpg, .jpeg, .png"
                          onChange={handleFileChange}
                          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </label>
                    </div>
                  </form>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-center p-1 rounded-b">
                  <button
                    className="bg-primary-blue text-white active:bg-black font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 dark:bg-dark-primary"
                    type="button"
                    onClick={handleUpdateLabAdmin}
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {/**Edit Lab Admin Success */}
      {showEditLabAdminSuccessModal ? (
        <NotificationModal
          show={showEditLabAdminSuccessModal}
          onClose={() => {
            setShowEditLabAdminSuccessModal(false);
          }}
          title="Notification"
          body=" Lab Admin Update Success! 🤗"
          color="green"
        />
      ) : null}
      {/**Edit Lab Admin unsuccess */}
      {showEditLabAdminUnsuccessModal ? (
        <NotificationModal
          show={showEditLabAdminUnsuccessModal}
          onClose={() => {
            setShowEditLabAdminUnsuccessModal(false);
          }}
          title="Notification"
          body="Lab Admin Update Unsuccess! 😥"
          color="red"
        />
      ) : null}

      {loading ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-primary-blue dark:text-white">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary-blue dark:border-white"></div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
}

export default LabProfile;
