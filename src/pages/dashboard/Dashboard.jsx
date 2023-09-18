import React from "react";

function Dashboard() {
  return (
    <div className="p-5 h-full w-full">
      <div className="p-2 w-full h-1/2">
        <div className="h-full w-full rounded-md shadow-md border-2 border-white dark:border-dark-ternary dark:shadow-dark-primary">
          <div className="flex justify-center items-center w-full h-1/6 p-2 border-b-2 border-white dark:border-dark-ternary">
            <h1 className="font-inter text-primary-blue">Report details</h1>
          </div>
          <div className="w-full h-5/6"></div>
        </div>
      </div>
      <div className="flex p-2 w-full h-1/2">
        <div className="h-full w-3/4 rounded-md shadow-md border-2 border-white dark:border-dark-ternary dark:shadow-dark-primary"></div>
        <p>&nbsp;&nbsp;&nbsp;</p>
        <div className="h-full w-1/4 rounded-md shadow-md border-2 border-white dark:border-dark-ternary dark:shadow-dark-primary"></div>
      </div>
    </div>
  );
}

export default Dashboard;
