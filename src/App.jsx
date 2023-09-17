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
import { auth, db, logout } from "./firebase";
import { ref, onValue } from "firebase/database";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [user] = useAuthState(auth);
  const [userTypeError, setUserTypeError] = useState(0);
  
  useEffect(() => {
    if (user == null) {
      localStorage.removeItem("gmail");
      setIsLoggedIn(false);
    } else {
      //checking the user type is match or not
      const labRef = ref(db, `labs/${user.uid}/type`);
      onValue(labRef, (snapshot) => {
        if (snapshot.exists()) {
          const userType = snapshot.val();
          // Redirect based on user role
          if (userType === "lab") {
            const _user = JSON.parse(localStorage.getItem("gmail"));
            console.log(user.email, " is signed in successfully!");
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
            console.log("User type isn't match!");
            setUserTypeError(1);
            logout();
          }
        }
      });
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
              <div className="flex w-full h-[65px] bg-secondary-blue dark:bg-black dark:opacity-100">
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
                      <SignIn userTypeError={userTypeError} />
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
