import React, { useEffect, useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { db, auth } from "../../firebase";
import { ref, onValue } from "firebase/database";
import NotificationModal from "../Modal/NotificationModal";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import UserPaymentTable from "../tables/UserPaymentTable";
import DownloadBtn from "../tables/sampleTable/DownloadBtn";
import DebouncedInput from "../tables/sampleTable/DebouncedInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faPhoneVolume,
  faLocationDot,
  faEnvelope,
  faRuler,
  faWeightScale,
  faDroplet,
  faCakeCandles,
} from "@fortawesome/free-solid-svg-icons";

function Payment() {
  const [showMailModal, setShowMailModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [userData, setUserData] = useState([]); // State to store retrieved data
  const [selectedUser, setSelectedUser] = useState(null);
  const auth_user_email = auth.currentUser.email;
  const [age, setAge] = useState(0);
  const [bday, setBday] = useState("1999-12-14");
  const [mailSubject, setMailSubject] = useState("");

  const [showMailSendSuccessModal, setShowMailSendSuccessModal] =
    useState(false);
  const [showMailSendUnsuccessModal, setShowMailSendUnsuccessModal] =
    useState(false);

  //For EmailJS functioning
  const [user_name, setUser_name] = useState(null);
  const [user_email, setUser_email] = useState(null);
  const [message, setMessage] = useState("");

  // useEffect hook to fetch data from Firebase
  useEffect(() => {
    const userRef = ref(db, "users");
    onValue(userRef, (snapshot) => {
      const userData = [];
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        userData.push(user);
      });
      setUserData(userData);
    });

    if (selectedUser) {
      //calculating age
      setBday(selectedUser.bday);
      const today = new Date();
      const birthDate = new Date(bday);
      const ageDifference = today - birthDate; // Calculate the difference in milliseconds
      const calculatedAge = Math.floor(
        // Convert the difference to years
        ageDifference / (365.25 * 24 * 60 * 60 * 1000)
      );

      //For EmailJS functioning
      setUser_name(selectedUser.userName);
      setUser_email(selectedUser.email);

      setAge(calculatedAge);
    }
  }, [selectedUser]);

  //Function to handle view button
  const handleViewClick = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  // Function to handle edit button
  const handleMailSending = (user) => {
    setSelectedUser(user);
    setShowMailModal(true);
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("", {
      id: "P.No",
      cell: (info) => <span>{info.row.index + 1}</span>,
      header: "P.No",
    }),
    columnHelper.accessor("userName", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Name",
    }),
    columnHelper.accessor("method", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Payment method",
    }),
    columnHelper.accessor("date", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Payment date",
    }),
    columnHelper.accessor("time", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Payment time",
    }),
    columnHelper.accessor("", {
      header: "Action",
      cell: (info) => (
        <div className="flex items-center">
          <button
            className="bg-white text-blue border active:bg-black font-semibold uppercase text-sm px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            onClick={() => handleMailSending(info.row.original)}
          >
            Send a mail
          </button>
          <button
            className="bg-blue text-white active:bg-black font-semibold uppercase text-sm px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            onClick={() => handleViewClick(info.row.original)}
          >
            View User
          </button>
        </div>
      ),
    }),
  ];
  const [data] = useState(() => [...userData]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: userData,
    columns,
    state: {
      globalFilter,
    },
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  //email.js functions
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_ktl1q9y",
        "template_g1e0olw",
        form.current,
        "cqxzL_7BgBKKZE56c"
      )
      .then(
        (result) => {
          console.log(result.text);
          setShowMailModal(false);
          setShowMailSendSuccessModal(true);
        },
        (error) => {
          console.log(error.text);
          setShowMailSendUnsuccessModal(true);
        }
      );
  };

  return (
    <>
      <div className="flex flex-col w-full h-full">
        <div className="flex items-center w-full h-1/6 border-b border-ternary-blue dark:border-dark-ternary">
          <div className="flex justify-start items-center h-full w-1/2 p-3">
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Search all columns..."
            />
          </div>
          <div className="flex items-center justify-end h-full w-1/2 p-3">
            <DownloadBtn data={userData} fileName={"users"} />
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
          </div>
        </div>
        <div className="flex items-center justify-center w-full h-4/6 max-h-[450px] overflow-y-auto p-3 rounded">
          <UserPaymentTable tableName={table} />
        </div>
        <div className="flex items-center justify-center w-full h-1/6 p-3 border-t border-ternary-blue dark:border-dark-ternary">
          {/* pagination */}
          <div className="flex items-center justify-end mt-2 gap-2 text-ternary-blue dark:text-gray2">
            <button
              onClick={() => {
                table.previousPage();
              }}
              disabled={!table.getCanPreviousPage()}
              className="p-1 border border-gray-300 px-2 disabled:opacity-30"
            >
              {"<"}
            </button>
            <button
              onClick={() => {
                table.nextPage();
              }}
              disabled={!table.getCanNextPage()}
              className="p-1 border border-gray-300 px-2 disabled:opacity-30"
            >
              {">"}
            </button>

            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
            <span className="flex items-center gap-1">
              | Go to page:
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="border p-1 rounded w-16 bg-transparent"
              />
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="p-2 bg-transparent"
            >
              {[10, 20, 30, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/**mail modal */}
      {showMailModal ? (
        <div>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-primary-blue dark:text-white">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="p-2 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-ternary-blue dark:bg-dark-secondary dark:border-2 dark:border-dark-ternary outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-1 rounded-t">
                  <h3 className="text-xl font-semibold">Send mail</h3>
                  <button
                    className=" ml-auto  border-0 text-primary-blue font-semibold active:text-black"
                    onClick={() => setShowMailModal(false)}
                  >
                    <span className=" text-primary-blue drop-shadow-lg shadow-black h-6 w-6 text-3xl block dark:text-white flex items-center justify-center">
                      ×
                    </span>
                  </button>
                </div>
                <form ref={form} onSubmit={sendEmail}>
                  {/*body*/}
                  <div className="bg-white relative p-2 flex flex-col dark:bg-dark-ternary">
                    <div className="h-1/5 w-full flex pt-1 justify-end">
                      <div>
                        <p className="font-inter dark:text-gray1">
                          Admin :&nbsp;
                          <span className="font-semibold text-sm dark:text-white">
                            <input
                              className="border rounded-sm p-1 dark:bg-dark-ternary"
                              type="text"
                              name="from_name"
                              value={auth_user_email}
                            />
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="h-1/5 w-full flex pt-1 justify-end">
                      <div>
                        <p className="font-inter dark:text-gray1">
                          User name:&nbsp;
                          <span className="font-semibold text-sm dark:text-white">
                            <input
                              className="border rounded-sm p-1 dark:bg-dark-ternary"
                              type="text"
                              name="user_name"
                              value={user_name}
                            />
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="h-1/5 w-full flex pt-1 justify-end">
                      <div>
                        <p className="font-inter dark:text-gray1">
                          Email :&nbsp;
                          <span className="font-semibold text-sm dark:text-white">
                            <input
                              className="border rounded-sm p-1 dark:bg-dark-ternary"
                              type="text"
                              name="user_email"
                              value={user_email}
                            />
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="h-1/5 w-full flex flex-col">
                      <div>
                        <p>&nbsp;</p>
                        <p className="font-inter dark:text-gray1">Message :</p>
                      </div>
                      <div className="pb-1">
                        <div className="w-full h-full pt-1">
                          <textarea
                            value={message}
                            name="message"
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter message here..."
                            className="h-full w-full rounded p-2 bg-white border-primary-blue dark:border-gray2 dark:bg-dark-ternary text-primary-blue dark:text-gray2 border-2 pl-5 font-light placeholder:text-primary-blue dark:placeholder:text-gray2"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-center p-1 rounded-b">
                    <button
                      className="bg-primary-blue text-white active:bg-black font-bold uppercase text-md px-3 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 dark:bg-dark-primary"
                      type="submit"
                    >
                      <FontAwesomeIcon icon={faPaperPlane} />
                      &nbsp; Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="rounded-lg opacity-50 fixed inset-0 z-40 bg-black"></div>
        </div>
      ) : null}

      {/**view modal */}
      {showViewModal ? (
        <div>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-primary-blue dark:text-white">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="p-2 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-ternary-blue dark:bg-dark-secondary dark:border-2 dark:border-dark-ternary outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-1 rounded-t">
                  <h3 className="text-xl font-semibold">User Info</h3>
                  <button
                    className=" ml-auto  border-0 text-primary-blue font-semibold active:text-black"
                    onClick={() => setShowViewModal(false)}
                  >
                    <span className=" text-primary-blue drop-shadow-lg shadow-black h-6 w-6 text-3xl block dark:text-white flex items-center justify-center">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="w-full h-full bg-white dark:bg-dark-ternary p-3">
                  <div className="flex p-1">
                    <div className="h-full w-1/2 p-2">
                      <div className="flex items-center justify-center ">
                        <img
                          className="rounded-full border-4 border-white drop-shadow-lg w-1/2 h-1/2 object-cover"
                          src={selectedUser.proPic}
                          alt="proPic"
                        />
                      </div>
                      <p className="h-1/2 w-full font-md p-2  text-center font-inter font-semibold text-2xl">
                        {selectedUser.userName}
                      </p>
                      <p className="h-1/4 w-full font-md p-2  text-center font-inter text-sm">
                        {age} years old
                      </p>
                      <p className="h-1/4 w-full font-md p-2  text-center font-inter text-sm">
                        <FontAwesomeIcon icon={faCakeCandles} />
                        &nbsp;&nbsp;&nbsp;
                        {selectedUser.bday}
                      </p>
                    </div>
                    <div className="h-full w-1/2 p-2 font-inter">
                      <div className="w-full h-1/2 text-sm">
                        <p className="font-bold text-lg pb-3">
                          Contact Details:
                        </p>
                        <p className="h-full w-full">
                          <FontAwesomeIcon icon={faPhoneVolume} />
                          &nbsp;&nbsp;&nbsp;{selectedUser.telephone}
                        </p>
                        <p className="h-full w-full">
                          <FontAwesomeIcon icon={faEnvelope} />
                          &nbsp;&nbsp;&nbsp;{selectedUser.email}
                        </p>
                        <p className="h-full w-full">
                          <FontAwesomeIcon icon={faLocationDot} />
                          &nbsp;&nbsp;&nbsp;{selectedUser.address},&nbsp;
                          {selectedUser.district},&nbsp;{selectedUser.province}{" "}
                          province,&nbsp;Sri Lanka.
                        </p>
                      </div>
                      <p>&nbsp;</p>
                      <div className="w-full h-1/2 text-sm">
                        <p className="font-bold text-lg pb-3">
                          Biometric Details:
                        </p>
                        <p className="h-full w-full">
                          <FontAwesomeIcon icon={faRuler} />
                          &nbsp;&nbsp;&nbsp;{selectedUser.height} ft
                        </p>
                        <p className="h-full w-full">
                          <FontAwesomeIcon icon={faWeightScale} />
                          &nbsp;&nbsp;&nbsp;{selectedUser.weight} Kg
                        </p>
                        <p className="h-full w-full">
                          <FontAwesomeIcon icon={faDroplet} />
                          &nbsp;&nbsp;&nbsp;{selectedUser.blood} blood group
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg opacity-50 fixed inset-0 z-40 bg-black"></div>
        </div>
      ) : null}

      {/**Mail send success modal */}
      {showMailSendSuccessModal ? (
        <NotificationModal
          show={showMailSendSuccessModal}
          onClose={() => {
            setShowMailSendSuccessModal(false);
          }}
          title="Notification"
          body="Mail send Successfull! 😎"
          color="green"
        />
      ) : null}

      {/**Mail send Unsuccess modal */}
      {showMailSendUnsuccessModal ? (
        <NotificationModal
          show={showMailSendUnsuccessModal}
          onClose={() => {
            setShowMailSendUnsuccessModal(false);
          }}
          title="Notification"
          body="Mail send Unsuccessfull! 😥"
          color="red"
        />
      ) : null}
    </>
  );
}

export default Payment;
