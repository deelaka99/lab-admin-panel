import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import { auth} from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import googleLogo from "../../assets/images/google.png";

function SignIn(props) {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [_user, setUser] = useState("");
  const { userTypeError } = props;

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setUser(user);
        localStorage.setItem("gmail", true);
        if (user) navigate("/admin/dashboard");
      })
      .catch((e) => {
        setError(true);
      });
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
                  {error && <span>Invalid Email or Password!</span> &&
                  userTypeError === 1 ? (
                    <span>User type doesn't match!</span>
                  ) : null}
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
                    <p className="text-[9px] md:text-[12px] lg:text-[15px] font-bold text-primary-blue hover:text-blue1 active:text-black">
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
      {/*right container*/}
      <div className="h-full w-1/2 bg-primary-blue opacity-80"></div>
    </div>
  );
}

export default SignIn;
