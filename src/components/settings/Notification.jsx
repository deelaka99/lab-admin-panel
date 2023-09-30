import React from "react";

function Notification() {
  return (
    <div className="w-11/12 h-5/6 p-2 text-white">
      <div className="w-full h-3/5">
        <div className="w-full h-1/4 flex justify-start items-center">
          <h1 className="text-xl font-semibold font-inter">Reminders :</h1>
        </div>
        <div className="w-full h-3/4 flex">
          <div className="h-full w-1/12 flex flex-col"></div>
          <div className="h-full w-9/12 flex items-center justify-center text-lg">
            <table className="h-5/6 w-full">
              <tr className="">
                <td className="w-3/4">
                  <h1>Show previews</h1>
                </td>
                <td className="w-1/4">
                  <input type="checkbox" className="w-5 h-5" />
                </td>
              </tr>
              <tr className="">
                <td className="w-3/4">
                  <h1>Show notifications for payments</h1>
                </td>
                <td className="w-1/4">
                  <input type="checkbox" className="w-5 h-5" />
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div className="w-full h-2/5">
        <div className="w-full h-1/4 flex justify-start items-center">
          <h1 className="text-xl font-semibold font-inter">Sounds :</h1>
        </div>
        <div className="w-full h-3/4 flex">
          <div className="h-full w-1/12 flex flex-col"></div>
          <div className="h-full w-9/12 flex items-center justify-center text-lg">
            <table className="h-5/6 w-full">
              <tr className="">
                <td className="w-3/4">
                  <h1>Play sounds for reminders</h1>
                </td>
                <td className="w-1/4">
                  <input type="checkbox" className="w-5 h-5" />
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notification;
