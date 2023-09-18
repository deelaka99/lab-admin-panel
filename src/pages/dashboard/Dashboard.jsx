import React from "react";

function Dashboard() {
  return (
    <div className="p-5 h-full w-full">
      <div className="p-2 w-full h-1/2">
        <div className="h-full w-full rounded-md shadow-md border-2 border-white"></div>
      </div>
      <div className="flex p-2 w-full h-1/2">
        <div className="h-full w-3/4 rounded-md shadow-md border-2 border-white"></div>
        <p>&nbsp;&nbsp;&nbsp;</p>
        <div className="h-full w-1/4 rounded-md shadow-md border-2 border-white"></div>
      </div>
    </div>
  );
}

export default Dashboard;
