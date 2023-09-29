import { React, useEffect, useState } from "react";
import { auth, db, storage } from "../../firebase";
import { set, ref, onValue } from "firebase/database";
import { ref as ref1, uploadBytes, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

function AddNewReport() {
  const [showAddedSuccessModal, setShowAddedSuccessModal] = useState(false);
  const [showAddedUnsuccessModal, setShowAddedUnsuccessModal] = useState(false);
  //variable state
  const [operatorName, setOperatorName] = useState("");
  const [typeName, setTypeName] = useState("");
  const activeStatus = false;
  const [metric1, setMetric1] = useState("");
  const [metric2, setMetric2] = useState("");
  const [metric3, setMetric3] = useState("");
  const [metric4, setMetric4] = useState("");
  const [metricVal1, setMetricVal1] = useState("Text");
  const [metricVal2, setMetricVal2] = useState("Text");
  const [metricVal3, setMetricVal3] = useState("Text");
  const [metricVal4, setMetricVal4] = useState("Text");
  const [reportIcon, setReportIcon] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFilePath, setSelectedFilePath] = useState(null);
  const [loading, setLoading] = useState(false);

  //error states
  const [operatorNameError, setOperatorNameError] = useState("");
  const [typeNameError, setTypeNameError] = useState("");
  const [reportIconError, setReportIconError] = useState("");
  const [reportIconUploadError, setReportIconUploadError] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const labOpRef = ref(db, `labs/${user.uid}`);
      const unsubscribe = onValue(labOpRef, (snapshot) => {
        if (snapshot.exists()) {
          const labOpData = snapshot.val();
          const labOpName = labOpData.LabName; // Assuming "name" is the field containing the admin username
          setOperatorName(labOpName);
        }
      });

      // Unsubscribe from the onValue listener when the component unmounts
      return () => {
        unsubscribe();
      };
    }
  }, []);

  //write
  const writeToDatabase = () => {
    //validation checks
    let isValid = true;

    if (!operatorName) {
      setOperatorNameError("Operator name is required");
      isValid = false;
    }

    if (!typeName) {
      setTypeNameError("Report Type-name is required");
      isValid = false;
    }

    if (!selectedFile) {
      setReportIconError("Please select an image");
      isValid = false;
    } else if (!selectedFile.type.startsWith("image/")) {
      setReportIconError("Please select a valid image file");
      isValid = false;
    } else if (selectedFile.size > 5 * 1024 * 1024) {
      setReportIconError("File size exceeds the maximum limit of 5MB");
      isValid = false;
    }

    if (reportIconError) {
      isValid = false;
    }

    if (reportIconUploadError) {
      isValid = false;
    }

    if (!isValid) {
      setShowAddedUnsuccessModal(true);
      return; //not proceed if there are validation errors
    } else {
      //writting data to the firebase
      try {
        setLoading(true); // Set loading state to true
        // Upload profile picture to Firebase Storage
        const storageRef = ref1(storage, "reportIcons/" + typeName);
        uploadBytes(storageRef, selectedFile)
          .then(async () => {
            // Retrieve the download URL after the upload is complete
            const downloadURL = await getDownloadURL(storageRef);
            setReportIcon(downloadURL);

            set(ref(db, `reportTypes/${typeName}`), {
              typeName,
              operatorName,
              reportIcon: downloadURL,
              activeStatus,
              metric1,
              metric2,
              metric3,
              metric4,
              metricVal1,
              metricVal2,
              metricVal3,
              metricVal4,
            });

            setShowAddedSuccessModal(true);
          })
          .catch((error) => {
            setReportIconUploadError(
              "Error occured when uploading Report-icon"
            );
            setLoading(false);
            console.log("Error uploading Report-icon", error);
            setShowAddedUnsuccessModal(true);
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        setShowAddedUnsuccessModal(true);
        console.log("Error adding Report-type", error);
        setLoading(false);
      }
    }
  };

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

  return (
    <div className="flex flex-col w-full h-full ">
      <div className="h-full w-full flex items-center justify-center">
        <div className="border-2 border-ternary-blue bg-primary-blue bg-opacity-50 dark:bg-dark-primary dark:border-dark-ternary h-5/6 w-11/12 rounded-3xl flex flex-col">
          <div className="h-full w-full p-2 text-white">
            {/* row contaqiner 1 */}
            <div className="w-full h-1/4">
              {/* row 1 */}
              <div className="flex w-full h-1/2">
                <div className="flex w-1/2 h-full">
                  <div className="flex items-center h-full w-2/6 pl-3">
                    Operator
                  </div>
                  <div className="flex items-center justify-center h-full w-4/6">
                    <div className="h-full w-full p-2">
                      <input
                        type="text"
                        placeholder="Enter operator name"
                        className={`${
                          operatorNameError === ""
                            ? "bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary"
                            : "border-white bg-red-2 text-white"
                        } w-full h-full rounded-full text-white dark:text-gray1 border-secondary-blue border-2 p-3 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1`}
                        value={operatorName}
                        onChange={(e) => {
                          setOperatorName(e.target.value);
                          setOperatorNameError("");
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center w-1/2 h-full">
                  <div className="flex items-center h-full w-2/6 pl-3">
                    Type name
                  </div>
                  <div className="flex items-center justify-center h-full w-4/6">
                    <div className="h-full w-full p-2">
                      <input
                        type="text"
                        placeholder="Enter type-name"
                        className={`${
                          typeNameError === ""
                            ? "bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary"
                            : "border-white bg-red-2 text-white"
                        } w-full h-full rounded-full text-white dark:text-gray1 border-secondary-blue border-2 p-3 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1`}
                        value={typeName}
                        onChange={(e) => {
                          setTypeName(e.target.value);
                          setTypeNameError("");
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* row 2 */}
              <div className="flex w-full h-1/2">
                <div className="flex items-center justify-center w-full h-full">
                  <label className="relative cursor-pointer bg-ternary-blue text-primary-blue text-md font-lg font-inter py-2 px-3 rounded-full shadow-md hover:bg-white hover:shadow-xl dark:bg-dark-secondary dark:border-2 dark:border-dark-ternary dark:text-gray1">
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
              </div>
            </div>
            {/* row contaqiner 2 */}
            <div className="w-full h-2/4">
              {/* row 1 */}
              <div className="flex w-full h-1/4">
                <div className="w-1/2 h-full">
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="flex items-center h-full w-2/6 pl-3">
                      Metric 1
                    </div>
                    <div className="flex items-center justify-center h-full w-4/6">
                      <div className="h-full w-full p-2">
                        <input
                          type="text"
                          placeholder="Enter metric 1"
                          className="bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary
                               w-full h-full rounded-full text-white dark:text-gray1 border-2 p-3 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1"
                          value={metric1}
                          onChange={(e) => {
                            setMetric1(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 h-full">
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="flex items-center h-full w-2/6 pl-3">
                      Value type
                    </div>
                    <div className="flex items-center justify-center h-full w-4/6">
                      <div className="h-full w-full p-2">
                        {/* Dropdown for Value type */}
                        <select
                          value={metricVal1}
                          placeholder="Enter value type"
                          onChange={(e) => {
                            setMetricVal1(e.target.value);
                          }}
                          className="bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary
                          w-full h-full rounded-full text-white dark:text-gray1 border-2 pl-3 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1"
                        >
                          <option className="text-primary-blue" value="text">
                            Text
                          </option>
                          <option className="text-primary-blue" value="number">
                            Number
                          </option>
                          <option className="text-primary-blue" value="date">
                            Date
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* row 2 */}
              <div className="flex w-full h-1/4">
                <div className="w-1/2 h-full">
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="flex items-center h-full w-2/6 pl-3">
                      Metric 2
                    </div>
                    <div className="flex items-center justify-center h-full w-4/6">
                      <div className="h-full w-full p-2">
                        <input
                          type="text"
                          placeholder="Enter metric 2"
                          className="bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary
                          w-full h-full rounded-full text-white dark:text-gray1 border-2 p-3 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1"
                          value={metric2}
                          onChange={(e) => {
                            setMetric2(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 h-full">
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="flex items-center h-full w-2/6 pl-3">
                      Value type
                    </div>
                    <div className="flex items-center justify-center h-full w-4/6">
                      <div className="h-full w-full p-2">
                        {/* Dropdown for Value type */}
                        <select
                          value={metricVal2}
                          placeholder="Enter value type"
                          onChange={(e) => {
                            setMetricVal2(e.target.value);
                          }}
                          className="bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary
                          w-full h-full rounded-full text-white dark:text-gray1 border-2 pl-3 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1"
                        >
                          <option className="text-primary-blue" value="text">
                            Text
                          </option>
                          <option className="text-primary-blue" value="number">
                            Number
                          </option>
                          <option className="text-primary-blue" value="date">
                            Date
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* row 3 */}
              <div className="flex w-full h-1/4">
                <div className="w-1/2 h-full">
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="flex items-center h-full w-2/6 pl-3">
                      Metric 3
                    </div>
                    <div className="flex items-center justify-center h-full w-4/6">
                      <div className="h-full w-full p-2">
                        <input
                          type="text"
                          placeholder="Enter metric 3"
                          className="bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary
                          w-full h-full rounded-full text-white dark:text-gray1 border-2 p-3 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1"
                          value={metric3}
                          onChange={(e) => {
                            setMetric3(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 h-full">
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="flex items-center h-full w-2/6 pl-3">
                      Value type
                    </div>
                    <div className="flex items-center justify-center h-full w-4/6">
                      <div className="h-full w-full p-2">
                        {/* Dropdown for Value type */}
                        <select
                          value={metricVal3}
                          placeholder="Enter value type"
                          onChange={(e) => {
                            setMetricVal3(e.target.value);
                          }}
                          className="bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary
                          w-full h-full rounded-full text-white dark:text-gray1 border-2 pl-3 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1"
                        >
                          <option className="text-primary-blue" value="text">
                            Text
                          </option>
                          <option className="text-primary-blue" value="number">
                            Number
                          </option>
                          <option className="text-primary-blue" value="date">
                            Date
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* row 4 */}
              <div className="flex w-full h-1/4">
                <div className="w-1/2 h-full">
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="flex items-center h-full w-2/6 pl-3">
                      Metric 4
                    </div>
                    <div className="flex items-center justify-center h-full w-4/6">
                      <div className="h-full w-full p-2">
                        <input
                          type="text"
                          placeholder="Enter metric 4"
                          className="bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary
                          w-full h-full rounded-full text-white dark:text-gray1 border-2 p-3 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1"
                          value={metric4}
                          onChange={(e) => {
                            setMetric4(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 h-full">
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="flex items-center h-full w-2/6 pl-3">
                      Value type
                    </div>
                    <div className="flex items-center justify-center h-full w-4/6">
                      <div className="h-full w-full p-2">
                        {/* Dropdown for Value type */}
                        <select
                          value={metricVal4}
                          placeholder="Enter value type"
                          onChange={(e) => {
                            setMetricVal4(e.target.value);
                          }}
                          className="bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary
                          w-full h-full rounded-full text-white dark:text-gray1 border-2 pl-3 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1"
                        >
                          <option className="text-primary-blue" value="text">
                            Text
                          </option>
                          <option className="text-primary-blue" value="number">
                            Number
                          </option>
                          <option className="text-primary-blue" value="date">
                            Date
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* row contaqiner 3 */}
            <div className="w-full h-1/4">
              <div className="h-full w-full flex justify-center items-center">
                <div className="h-full w-3/5 p-2"></div>
                <div className="h-4/5 w-2/5 p-5 flex items-center justify-center">
                  <button
                    className="bg-secondary-blue hover:opacity-90 dark:bg-dark-ternary h-full w-full rounded-md text-xl shadow-xl text-white"
                    onClick={writeToDatabase}
                  >
                    Add Report Type
                  </button>
                </div>
              </div>
            </div>
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
                    Report Added Successfully ! 😎
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
                    Report Added Unsuccessfully ! 😢
                  </h3>
                  {typeNameError && (
                    <p className="h-1/6 pt-1 text-xs text-center text-white">
                      - {typeNameError} -
                    </p>
                  )}
                  {operatorNameError && (
                    <p className="h-1/6 pt-1 text-xs text-center text-white">
                      - {operatorNameError} -
                    </p>
                  )}
                  {reportIconError && (
                    <p className="h-1/6 pt-1 text-xs text-center text-white">
                      - {reportIconError} -
                    </p>
                  )}
                  {reportIconUploadError && (
                    <p className="h-1/6 pt-1 text-xs text-center text-white">
                      - {reportIconUploadError} -
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
    </div>
  );
}

export default AddNewReport;
