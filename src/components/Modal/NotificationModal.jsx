import React from 'react';

const NotificationModal = ({ show, onClose, title, body, color }) => {
  if (!show) {
    return null;
  }

  return (
    <div>
      <div className={`justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none  ${color==="yellow"?"text-black":"text-white"}`}>
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className={`p-5 rounded-lg shadow-lg relative flex flex-col w-full ${color === "green" ? "bg-green":color==="red"?"bg-red":"bg-yellow"} border-2 outline-none focus:outline-none`}>
            {/*header*/}
            <div className="flex items-start justify-between p-2 rounded-t">
              <h3 className="text-sm">{title}</h3>
              <button
                className={`ml-auto ${color === "green" ? "bg-red":"bg-red-1"} rounded-sm border-0 text-lg font-semibold drop-shadow-md active:bg-white`}
                onClick={onClose}
              >
                <span className=" drop-shadow-lg shadow-black h-6 w-6 text-white flex items-center justify-center active:text-dark-ternary">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex flex-col">
              <h3 className="text-2xl font-semibold">{body}</h3>
            </div>
            {/*footer*/}
          </div>
        </div>
      </div>
      <div className="rounded-lg opacity-50 fixed inset-0 z-40 bg-black"></div>
    </div>
  );
};

export default NotificationModal;
