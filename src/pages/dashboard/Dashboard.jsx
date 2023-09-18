import React from "react";
import Card from "../../components/dashboardCard/Card";
import Card1 from "../../components/dashboardCard/Card1";

function Dashboard() {
  return (
    <div className="p-5 h-full w-full">
      <div className="p-2 w-full h-1/2">
        <div className="h-full w-full rounded-md shadow-md border-2 border-white dark:border-dark-ternary dark:shadow-dark-primary">
          <div className="flex justify-center items-center w-full h-1/6 p-2 border-b-2 border-white dark:border-dark-ternary">
            <h1 className="font-inter text-primary-blue">Report details</h1>
          </div>
          <div className="flex justify-center items-center w-full h-5/6 p-5">
            <Card color={"orange"} title={"Report Types"} count={"18"} />
            <p>&nbsp;&nbsp;&nbsp;</p>
            <Card color={"green"} title={"Pending Reports"} count={"22"} />
            <p>&nbsp;&nbsp;&nbsp;</p>
            <Card color={"red"} title={"Total Report Sent"} count={"100"} />
            <p>&nbsp;&nbsp;&nbsp;</p>
            <Card color={"blue"} title={"User Feedbacks"} count={"1800"} />
          </div>
        </div>
      </div>
      <div className="flex p-2 w-full h-1/2">
        <div className="h-full w-3/4 rounded-md shadow-md border-2 border-white dark:border-dark-ternary dark:shadow-dark-primary"></div>
        <p>&nbsp;&nbsp;&nbsp;</p>
        <div className="h-full w-1/4 rounded-md shadow-md border-2 border-white dark:border-dark-ternary dark:shadow-dark-primary">
          <div className="flex justify-center items-center w-full h-1/6 p-2 border-b-2 border-white dark:border-dark-ternary">
            <h1 className="font-inter text-primary-blue">User Management</h1>
          </div>
          <div className="flex justify-center items-center w-full h-5/6 p-5">
            <Card1 color={"blue"} title={"Registered Users"} count={"185"} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
