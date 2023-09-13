import React from "react";
function SignIn() {
  return (
    //main container
    <div
      className="w-screen h-screen flex bg-cover bg-center"
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
              <h1 className="font-jomhuria text-5xl text-blue">
                Sharp<span className="text-blue1">Tester</span>
              </h1>
            </div>
            <div className="w-full h-2/3 p-3 flex flex-col items-center justify-center">
              <h1 className="text-3xl font-semibold font-inter">
                Log in to your account
              </h1>
              <p className="font-inter text-sm">
                Welcome back! please Enter your login details
              </p>
            </div>
          </div>
          {/**lower container */}
          <div className="w-full h-5/6 flex justify-center items-center">
            {/**form container */}
            <form className="h-5/6 w-5/6 flex flex-col justify-center items-center">
              {/**form upper container*/}
              <div className="flex flex-col justify-center items-center w-full h-1/2">
                <div className="w-5/6 h-1/2  flex flex-col items-start justify-center">
                  <p className="font-inter font-semibold">Email</p>
                  <input
                    className="w-full h-3/6 rounded-full border-2 border-secondary-blue bg-ternary-blue"
                    type="text"
                    name=""
                    id=""
                  />
                </div>
                <div className="w-5/6 h-1/2  flex flex-col items-start justify-center">
                  <p className="font-inter font-semibold">Password</p>
                  <input
                    className="w-full h-3/6 rounded-full border-2 border-secondary-blue bg-ternary-blue"
                    type="text"
                    name=""
                    id=""
                  />
                </div>
              </div>
              {/**form lower container*/}
              <div className="w-5/6 h-1/2">
                <div className="flex w-full h-1/4">
                  <div className="w-1/3 h-full flex items-center justify-center">
                    <input
                      className="w-5 h-5 hover:border-1"
                      type="checkbox"
                      name=""
                      id=""
                    />
                    <span>&nbsp;&nbsp;Remember me</span>
                  </div>
                  <div className="w-1/3 h-full"></div>
                  <div className="w-1/3 h-full flex items-center justify-center">
                    <p className="font-bold text-primary-blue hover:text-blue1 active:text-black">
                      Forgot Password
                    </p>
                  </div>
                </div>
                <div className="w-full h-1/4 flex items-center justify-center">
                  <button className="bg-primary-blue text-ternary-blue w-3/6 h-5/6 rounded-lg shadow-sm font-inter hover:bg-blue1 hover:shadow-xl">
                    Sign In
                  </button>
                </div>
                <div className="w-full h-1/4 flex items-center justify-center">
                  <button className="bg-gray1 text-black w-3/6 h-5/6 rounded-lg shadow-sm font-inter hover:bg-gray2 hover:shadow-xl">
                    Sign In with Google
                  </button>
                </div>
                <div className="w-full h-1/4 bg-blue1"></div>
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
