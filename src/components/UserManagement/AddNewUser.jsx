import { React, useEffect, useState } from "react";
import bcrypt from "bcryptjs";
import { auth, db, logout } from "../../firebase";
//import { uid } from "uid";
import { set, ref, onValue } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

function AddNewUser() {
  const [showAddedSuccessModal, setShowAddedSuccessModal] = useState(false);
  const [showAddedUnsuccessModal, setShowAddedUnsuccessModal] = useState(false);
  //variable state
  const [operatorName, setOperatorName] = useState("");
  const [userName, setUserName] = useState("");
  const [district, setDistrict] = useState("Colombo");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("Western");
  const [email, setEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFilePath, setSelectedFilePath] = useState(null);

  //error states
  const [operatorNameError, setOperatorNameError] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [districtError, setDistrictError] = useState("");
  const [telephoneError, setTelephoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [provinceError, setProvinceError] = useState("");
  const [emailError, setEmailError] = useState("");

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

    //password validation things
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/\-="']/.test(
      password
    );
    const isLengthValid = password.length >= 8; // minimum 8 characters

    //email validation things
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!operatorName) {
      setOperatorNameError("Operator name is required");
      isValid = false;
    }

    if (!userName) {
      setUserNameError("User name is required");
      isValid = false;
    }

    if (!district) {
      setDistrictError("District is required");
      isValid = false;
    }

    if (!telephone) {
      setTelephoneError("Telephone number is required");
      isValid = false;
    } else if (!/^\d{10}$/.test(telephone)) {
      setTelephoneError(
        "Invalid telephone number. Please enter a 10-digit number."
      );
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (
      !hasUppercase ||
      !hasLowercase ||
      !hasNumber ||
      !hasSpecialChar ||
      !isLengthValid
    ) {
      setPasswordError(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long."
      );
      isValid = false;
    }

    if (!address) {
      setAddressError("Address is required");
      isValid = false;
    }

    if (!province) {
      setProvinceError("Province is required");
      isValid = false;
    }

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!emailPattern.test(email)) {
      setEmailError(
        "Invalid email format. Please enter a valid email address."
      );
      isValid = false;
    }

    if (!isValid) {
      setShowAddedUnsuccessModal(true);
      return; //not proceed if there are validation errors
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hashedPassword) => {
          if (err) {
            console.error("Error hashing password:", err);
            return;
          }

          // create a lab admin
          createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
              //writting data to the firebase
              const uid = auth.currentUser.uid;
              set(ref(db, `users/${uid}`), {
                uid,
                operatorName,
                userName,
                district,
                telephone,
                password: hashedPassword, //store the hashed password
                address,
                province,
                email,
                type: "user",
                blocked: false,
              });

              setOperatorName("");
              setUserName("");
              setDistrict("");
              setTelephone("");
              setPassword("");
              setAddress("");
              setProvince("");
              setEmail("");

              setShowAddedSuccessModal(true);

              // Delay the logout function call for 3 seconds
              setTimeout(() => {
                logout();
              }, 3000); // 3000 milliseconds = 3 seconds
            })
            .catch((error) => {
              console.error("Error creating the user:", error);
            });
        });
      });
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
          <div className="h-3/5 w-full p-2 flex text-white">
            {/**first column */}
            <div className="w-1/2 h-full p-3">
              <div className="h-1/4 w-full flex">
                <div className="h-full w-2/6 flex items-center text-ternary-blue dark:text-gray1">
                  Operator
                </div>
                <div className="h-full w-4/6 p-2">
                  <input
                    type="text"
                    placeholder="Enter operator's name"
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
              <div className="h-1/4 w-full flex">
                <div className="h-full w-2/6 flex items-center text-ternary-blue dark:text-gray1">
                  User name
                </div>
                <div className="h-full w-4/6 p-2">
                  <input
                    type="text"
                    placeholder="Enter username"
                    className={`${
                      userNameError === ""
                        ? "bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary"
                        : "border-white bg-red-2 text-white"
                    } w-full h-full rounded-full text-white dark:text-gray1 border-secondary-blue border-2 p-3 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1`}
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                      setUserNameError("");
                    }}
                  />
                </div>
              </div>
              <div className="h-1/4 w-full flex">
                <div className="h-full w-2/6 flex items-center text-ternary-blue dark:text-gray1">
                  District
                </div>
                <div className="h-full w-4/6 p-2">
                  <input
                    type="text"
                    placeholder="Enter district"
                    className={`${
                      districtError === ""
                        ? "bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary"
                        : "border-white bg-red-2 text-white"
                    } w-full h-full rounded-full text-white dark:text-gray1 border-secondary-blue border-2 p-3 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1`}
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      setDistrictError("");
                    }}
                  />
                </div>
              </div>
              <div className="h-1/4 w-full flex">
                <div className="h-full w-2/6 flex items-center text-ternary-blue dark:text-gray1">
                  Telephone
                </div>
                <div className="h-full w-4/6 p-2">
                  <input
                    type="text"
                    placeholder="Enter telephone number"
                    className={`${
                      telephoneError === ""
                        ? "bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary"
                        : "border-white bg-red-2 text-white"
                    } w-full h-full rounded-full text-white dark:text-gray1 border-secondary-blue border-2 p-3 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1`}
                    value={telephone}
                    onChange={(e) => {
                      setTelephone(e.target.value);
                      setTelephoneError("");
                    }}
                  />
                </div>
              </div>
            </div>
            {/**Second column */}
            <div className="w-1/2 h-full p-3">
              <div className="h-1/4 w-full flex">
                <div className="h-full w-2/6 flex items-center text-ternary-blue dark:text-gray1">
                  Password
                </div>
                <div className="h-full w-4/6 p-2">
                  <input
                    type="password"
                    placeholder="Enter password"
                    className={`${
                      passwordError === ""
                        ? "bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary"
                        : "border-white bg-red-2 text-white"
                    } w-full h-full rounded-full text-white dark:text-gray1 border-secondary-blue border-2 p-3 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1`}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                  />
                </div>
              </div>
              <div className="h-1/4 w-full flex">
                <div className="h-full w-2/6 flex items-center text-ternary-blue dark:text-gray1">
                  Address
                </div>
                <div className="h-full w-4/6 p-2">
                  <input
                    type="text"
                    placeholder="Enter address"
                    className={`${
                      addressError === ""
                        ? "bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary"
                        : "border-white bg-red-2 text-white"
                    } w-full h-full rounded-full text-white dark:text-gray1 border-secondary-blue border-2 p-3 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1`}
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setAddressError("");
                    }}
                  />
                </div>
              </div>
              <div className="h-1/4 w-full flex">
                <div className="h-full w-2/6 flex items-center text-ternary-blue dark:text-gray1">
                  Province
                </div>
                <div className="h-full w-4/6 p-2">
                  <input
                    type="text"
                    placeholder="Enter province"
                    className={`${
                      provinceError === ""
                        ? "bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary"
                        : "border-white bg-red-2 text-white"
                    } w-full h-full rounded-full text-white dark:text-gray1 border-secondary-blue border-2 p-3 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1`}
                    value={province}
                    onChange={(e) => {
                      setProvince(e.target.value);
                      setProvinceError("");
                    }}
                  />
                </div>
              </div>
              <div className="h-1/4 w-full flex">
                <div className="h-full w-2/6 flex items-center text-ternary-blue dark:text-gray1">
                  Email
                </div>
                <div className="h-full w-4/6 p-2">
                  <input
                    type="text"
                    placeholder="Enter email"
                    className={`${
                      emailError === ""
                        ? "bg-ternary-blue bg-opacity-30 border-white dark:border-gray2 dark:bg-dark-ternary"
                        : "border-white bg-red-2 text-white"
                    } w-full h-full rounded-full text-white dark:text-gray1 border-secondary-blue border-2 p-3 font-semibold placeholder:text-white placeholder:font-light dark:placeholder:text-gray1`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center h-1/5 w-full">
            <label className="relative cursor-pointer bg-ternary-blue text-primary-blue text-md font-lg font-inter py-3 px-5 rounded-full shadow-md hover:bg-white hover:shadow-xl dark:bg-dark-secondary dark:border-2 dark:border-dark-ternary dark:text-gray1">
              <span>
                {selectedFile ? (
                  <div className="flex h-full w-full">
                    <div className="flex items-center justify-center">
                      <img
                        src={selectedFilePath}
                        alt="Selected"
                        className="w-10 h-10 rounded-full shadow-sm shadow-dark-primary"
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <span>
                        &nbsp;&nbsp;&nbsp;Change Profile
                        Picture&nbsp;&nbsp;&nbsp;
                        <FontAwesomeIcon icon={faCaretDown} />
                      </span>
                    </div>
                  </div>
                ) : (
                  <span>
                    Select Profile Picture&nbsp;&nbsp;&nbsp;
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
          <div className="h-1/5 w-full flex">
            <div className="h-full w-3/5 p-2"></div>
            <div className="h-full w-2/5 p-5 flex items-center justify-center">
              <button
                className="bg-secondary-blue hover:opacity-90 dark:bg-dark-ternary h-full w-full rounded-md text-xl shadow-xl text-white"
                onClick={writeToDatabase}
              >
                Add User
              </button>
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
                    User Added Successfully ! 😎
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
                    User Added Unsuccessfully ! 😢
                  </h3>
                  {userNameError && (
                    <p className="h-1/6 pt-1 text-xs text-center text-white">
                      - {userNameError} -
                    </p>
                  )}
                  {operatorNameError && (
                    <p className="h-1/6 pt-1 text-xs text-center text-white">
                      - {operatorNameError} -
                    </p>
                  )}
                  {districtError && (
                    <p className="h-1/6 pt-1 text-xs text-center text-white">
                      - {districtError} -
                    </p>
                  )}
                  {telephoneError && (
                    <p className="h-1/6 pt-1 text-xs text-center text-white">
                      - {telephoneError} -
                    </p>
                  )}
                  {passwordError && (
                    <p className="h-1/6 pt-1 text-xs text-center text-white">
                      - {passwordError} -
                    </p>
                  )}
                  {addressError && (
                    <p className="h-1/6 pt-1 text-xs text-center text-white">
                      - {addressError} -
                    </p>
                  )}
                  {provinceError && (
                    <p className="h-1/6 pt-1 text-xs text-center text-white">
                      - {provinceError} -
                    </p>
                  )}
                  {emailError && (
                    <p className="h-1/6 pt-1 text-xs text-center text-white">
                      - {emailError} -
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
    </div>
  );
}

export default AddNewUser;
