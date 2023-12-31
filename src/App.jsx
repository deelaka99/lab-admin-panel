import React, { useEffect, useState } from "react";
import { Navigate, BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/navbar/Navbar";
import SignIn from "./pages/signin/SignIn";
import Dashboard from "./pages/dashboard/Dashboard";
import UserManagement from "./pages/user-management/UserManagement";
import ReportManagement from "./pages/report-management/ReportManagement";
import CompanyPayments from "./pages/company-payments/CompanyPayments";
import AboutUs from "./pages/about-us/AboutUs";
import Settings from "./pages/settings/Settings";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user === null) {
      localStorage.removeItem("gmail");
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, [user]);

  return (
    <>
      <Router>
        <div className="flex h-screen w-screen overflow-hidden">
          {/* side bar */}
          {isLoggedIn && (
            <div className="h-full w-1/4 bg-primary-blue bg-opacity-80 dark:bg-black dark:opacity-90">
              <Sidebar />
            </div>
          )}
          {/* nav and body */}
          <div className="flex flex-col w-full h-full bg-ternary-blue dark:bg-dark-secondary">
            {/* nav */}
            {isLoggedIn && (
              <div className="flex w-full h-[65px] bg-primary-blue dark:bg-black dark:opacity-100">
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
                  <Route
                    path="user-management"
                    element={
                      isLoggedIn ? <UserManagement /> : <Navigate to={"/"} />
                    }
                  />
                  <Route
                    path="report-management"
                    element={
                      isLoggedIn ? <ReportManagement /> : <Navigate to={"/"} />
                    }
                  />
                  <Route
                    path="company-payments"
                    element={
                      isLoggedIn ? <CompanyPayments /> : <Navigate to={"/"} />
                    }
                  />
                  <Route
                    path="about-us"
                    element={isLoggedIn ? <AboutUs /> : <Navigate to={"/"} />}
                  />
                  <Route
                    path="settings"
                    element={isLoggedIn ? <Settings /> : <Navigate to={"/"} />}
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
