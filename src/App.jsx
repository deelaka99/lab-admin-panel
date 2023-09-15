import React, { useEffect, useState } from "react";
import { Navigate, BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/navbar/Navbar";
import SignIn from "./pages/signin/SignIn";
import Dashboard from "./pages/dashboard/Dashboard";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [user] = useAuthState(auth);

  //
  useEffect(() => {
    if (user == null) {
      localStorage.removeItem("gmail");
      setIsLoggedIn(false);
    } else {
      const _user = JSON.parse(localStorage.getItem("gmail"));
      console.log(_user);
      setIsLoggedIn(true);
    }
  }, [user]);

  return (
    <>
      <Router>
        <div className="flex h-screen w-screen overflow-hidden">
          {/* side bar */}
          {isLoggedIn && (
            <div className="h-full w-1/4 bg-primary-blue dark:bg-black dark:opacity-90">
              <Sidebar />
            </div>
          )}
          {/* nav and body */}
          <div className="flex flex-col w-full h-full bg-ternary-blue dark:bg-dark-secondary">
            {/* nav */}
            {isLoggedIn && (
              <div className="flex bg-red-800 w-full h-1/6 bg-primary-blue opacity-60 dark:bg-black dark:opacity-100">
                <Navbar />
              </div>
            )}

            {/* body */}
            <div className=" w-full h-full flex items-center justify-center dark:text-white">
              {/* Conditional rendering for admin routes */}

              <Routes>
                <Route
                  path="/"
                  element={
                    isLoggedIn ? (
                      <Navigate to={"admin/dashboard"} />
                    ) : (
                      <SignIn />
                    )
                  }
                />
                <Route path="/admin">
                  <Route
                    index
                    path="dashboard"
                    element={isLoggedIn ? <Dashboard /> : <Navigate to={"/"} />}
                  />
                </Route>
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
