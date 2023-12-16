import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import React, { useState } from "react";
import { auth, db, logout } from "../../firebase";
import { ref, get } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [resetEmail, setResetEmail] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [_user, setUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [userTypeError, setUserTypeError] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [showResetMailSentSuccessModal, setShowResetMailSentSuccessModal] =
    useState(false);
  const [showResetMailSentUnsuccessModal, setShowResetMailSentUnsuccessModal] =
    useState(false);

  const signIn = (e) => {
    setLoading(true);
    e.preventDefault();
    if (user === null) {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          const currentUser = auth.currentUser;

          // Get the user type from Firebase Realtime Database
          const labTypeRef = ref(db, `labs/${currentUser.uid}/type`);

          // Use the `get` function to fetch the user type
          get(labTypeRef)
            .then((snapshot) => {
              if (snapshot.exists()) {
                const userType = snapshot.val();

                // Check if the user type is "lab"
                if (userType === "lab") {
                  // Get the blocked statues from Firebase Realtime Database
                  const labBlockRef = ref(
                    db,
                    `labs/${currentUser.uid}/blocked`
                  );
                  // Use the `get` function to fetch the blocked status
                  get(labBlockRef)
                    .then((snapshot) => {
                      if (snapshot.exists()) {
                        const blockedStatus = snapshot.val();
                        // Check if the blocked status is "false"
                        if (blockedStatus === false) {
                          setUserTypeError(false);
                          console.log(
                            currentUser.email,
                            " is signed in successfully!"
                          );
                          setUser(currentUser);
                          localStorage.setItem("gmail", true);
                          if (currentUser) navigate("/admin/dashboard");
                          setError(false);
                          setLoading(false);
                        } else {
                          setLoading(false);
                          logout();
                          setError(true);
                          console.log(currentUser.email, " is blocked");
                        }
                      }
                    })
                    .catch((error) => {
                      setLoading(false);
                      console.log("Blocked status getting error :", error);
                    });
                } else {
                  console.log("User type isn't match!");
                  logout();
                  setError(true);
                  setUserTypeError(true);
                }
              } else {
                // If the lab doesn't exist for the user, show an error
                console.log("Lab not found for the user!");
                setLoading(false);
                logout();
                setError(true);
                setUserTypeError(true);
              }
            })
            .catch((error) => {
              setLoading(false);
              console.log("Error getting user type: ", error);
              setError(true);
              setUserTypeError(true);
            });
        })
        .catch((e) => {
          console.log("Sign in errors: ", e);
          setError(true);
          setLoading(false);
        });
    }
  };

  //forgot password function
  const handleForgotPassword = () => {
    setShowPasswordResetModal(true);
  };

  const handleEmailResetSendBtn = () => {
    if (resetEmail) {
      sendPasswordResetEmail(auth, resetEmail)
        .then(() => {
          setShowResetMailSentSuccessModal(true);
          setShowPasswordResetModal(false);
          setResetEmail("");
        })
        .catch((error) => {
          setShowResetMailSentUnsuccessModal(true);
        });
    }
  };

  return (
    //main container
    <div
      className="w-screen h-screen flex bg-cover bg-center text-black"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/4031321/pexels-photo-4031321.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
      }}
    >
      {/*left container*/}
      <div className="h-full w-1/2 bg-quternary-blue flex items-center justify-center">
        {/*body container*/}
        <div className="h-5/6 w-3/4">
          {/**upper container */}
          <div className="w-full h-1/6">
            <div className="w-full h-1/3 p-5 flex items-center justify-center">
              <h1 className="font-jomhuria text-lg md:text-3xl lg:text-5xl text-blue">
                Sharp<span className="text-blue1">Tester</span>
              </h1>
            </div>
            <div className="w-full h-2/3 p-3 flex flex-col items-center justify-center">
              <h1 className="text-lg md:text-2xl lg:text-3xl font-semibold font-inter">
                Log in to your account
              </h1>
              <p className="font-inter text-sm text-[10px] md:text-[12px] lg:text-[16px]">
                Welcome back! please Enter your login details
              </p>
            </div>
          </div>
          {/**lower container */}
          <div className="w-full h-5/6 flex justify-center items-center">
            {/**form container */}
            <form
              onSubmit={signIn}
              className="h-5/6 w-5/6 flex flex-col justify-center items-center"
            >
              {/**form upper container*/}
              <div className="flex flex-col justify-center items-center w-full h-1/2">
                <div className="w-5/6 h-1/2  flex flex-col items-start justify-center">
                  <p className="font-inter font-semibold">Email</p>
                  <input
                    className="w-full h-3/6 rounded-full border-2 p-5 text-lg text-[11px] md:text-[13px] lg:text-[16px] text-primary-blue font-semibold border-secondary-blue bg-ternary-blue"
                    type="email"
                    value={email}
                    placeholder="Enter your Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="w-5/6 h-1/2  flex flex-col items-start justify-center">
                  <p className="font-inter font-semibold">Password</p>
                  <input
                    className="w-full h-3/6 rounded-full border-2 p-5 text-lg text-[11px] md:text-[13px] lg:text-[16px] text-primary-blue font-semibold border-secondary-blue bg-ternary-blue"
                    type="password"
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              {/**form lower container*/}
              <div className="w-5/6 h-1/2">
                <div className="w-full h-1/6 text-red font-inter text-center font-bold p-3">
                  {/**login errors displaying  here */}
                  {error && (
                    <span>
                      {userTypeError
                        ? "User type doesn't match!"
                        : "Invalid Email or Password!"}
                    </span>
                  )}
                </div>
                <div className="flex w-full h-1/4">
                  <div className="w-1/2 h-full flex items-center justify-center">
                    <input
                      className="md:w-3 md:h-3 lg:w-4 lg:h-4 hover:border-1"
                      type="checkbox"
                    />
                    <span className="text-[9px] md:text-[12px] lg:text-[15px]">
                      &nbsp;&nbsp;Remember me
                    </span>
                  </div>

                  <div className="w-1/2 h-full flex items-center justify-center">
                    <p
                      className="text-[9px] md:text-[12px] lg:text-[15px] font-bold text-primary-blue hover:text-blue1 cursor-pointer"
                      onClick={handleForgotPassword}
                    >
                      Forgot Password
                    </p>
                  </div>
                </div>
                <div className="w-full h-1/4 flex items-center justify-center">
                  <button
                    type="submit"
                    className="bg-primary-blue text-ternary-blue w-3/6 h-5/6 text-[10px] md:text-[10px] lg:text-[16px] rounded-lg shadow-sm font-inter hover:bg-blue1 hover:shadow-xl"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/**Password reset modal */}
      {showPasswordResetModal ? (
        <div>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-primary-blue dark:text-white">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="p-2 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-ternary-blue dark:bg-dark-secondary dark:border-2 dark:border-dark-ternary outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-1 rounded-t">
                  <h3 className="text-md">Reset the password</h3>
                  <button
                    className=" ml-auto  border-0 text-primary-blue font-semibold active:text-black"
                    onClick={() => setShowPasswordResetModal(false)}
                  >
                    <span className=" text-primary-blue drop-shadow-lg shadow-black h-6 w-6 text-2xl dark:text-white flex items-center justify-center">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="bg-white relative p-2 flex items-center">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Enter your mail here"
                      className="rounded-tl-md rounded-bl-md p-1 h-3/5 w-full bg-white border-primary-blue border text-primary-blue text-sm font-light font-inter placeholder:text-primary-blue"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                    />
                    <button onClick={handleEmailResetSendBtn} className="rounded-tr-md rounded-br-md p-1 h-3/5 w-2/5 bg-primary-blue text-white text-sm text-center font-light font-inter">Send</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg opacity-50 fixed inset-0 z-40 bg-black"></div>
        </div>
      ) : null}

      {/**Success reset mail modal */}
      {showResetMailSentSuccessModal ? (
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
                    onClick={() => setShowResetMailSentSuccessModal(false)}
                  >
                    <span className=" drop-shadow-lg shadow-black h-6 w-6 text-white flex items-center justify-center active:text-dark-ternary">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex flex-col">
                  <h3 className="text-2xl font-semibold text-center">
                    Reset mail sent Successfully ! 😎
                  </h3>
                  <p className="text-center font-inter font-light text-sm">
                    -Go through your mailbox and look for the reset mail-
                  </p>
                </div>
                {/*footer*/}
              </div>
            </div>
          </div>
          <div className="rounded-lg opacity-50 fixed inset-0 z-40 bg-black"></div>
        </div>
      ) : null}

      {/**Unsuccess reset mail modal */}
      {showResetMailSentUnsuccessModal ? (
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
                    onClick={() => setShowResetMailSentUnsuccessModal(false)}
                  >
                    <span className=" drop-shadow-lg shadow-black h-6 w-6 text-white flex items-center justify-center active:text-dark-ternary">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex flex-col">
                  <h3 className="text-center text-2xl font-semibold">
                    Reset mail sent Unsuccessfully ! 😢
                  </h3>
                </div>
                {/*footer*/}
              </div>
            </div>
          </div>
          <div className="rounded-lg opacity-50 fixed inset-0 z-40 bg-black"></div>
        </div>
      ) : null}

      <div className="h-full w-1/2 bg-primary-blue opacity-80"></div>
      {loading ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-primary-blue">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary-blue"></div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
}

export default SignIn;
