import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { remove, ref, onValue } from "firebase/database";
import { ref as storageRef, deleteObject } from "firebase/storage";
import NotificationModal from "../Modal/NotificationModal";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import UserReportTable from "../tables/UserReportTable";
import DownloadBtn from "../tables/sampleTable/DownloadBtn";
import DebouncedInput from "../tables/sampleTable/DebouncedInput";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhoneVolume,
  faLocationDot,
  faEnvelope,
  faRuler,
  faWeightScale,
  faDroplet,
} from "@fortawesome/free-solid-svg-icons";

function UserReports() {
  const [uid, setUid] = useState(null);
  const [userName, setUserName] = useState("");
  const [tele, setTele] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [userPropic, setUserPropic] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bday, setbday] = useState("1999-12-14");
  const [age, setAge] = useState(0);
  const [bloodGroup, setBloodGroup] = useState("A+");
  const [userData, setUserData] = useState([]);
  const [reportType, setReportType] = useState("");
  const [reportSentDate, setReportSentDate] = useState("");
  const [reportSentTime, setReportSentTime] = useState("");
  const [reportData, setReportData] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);

  const [showReportRemoveSuccessModal, setShowReportRemoveSuccessModal] =
    useState(false);
  const [showReportRemoveUnsuccessModal, setShowReportRemoveUnsuccessModal] =
    useState(false);

  // useEffect hook to fetch data from Firebase
  useEffect(() => {
    //for reports
    const reportRef = ref(db, "userReports");
    onValue(reportRef, (snapshot) => {
      const reportData = [];
      snapshot.forEach((childSnapshot) => {
        const report = childSnapshot.val();
        reportData.push(report);
      });
      setReportData(reportData);
    });

    //for user
    const userRef = ref(db, `users`);
    onValue(userRef, (snapshot) => {
      const userData = [];
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        userData.push(user);
      });
      setUserData(userData);
    });

    if (uid) {
      userData.forEach((user) => {
        if (user.uid === uid) {
          setUserName(user.userName);
          setTele(user.telephone);
          setEmail(user.email);
          setAddress(user.address);
          setUserPropic(user.proPic);
          setDistrict(user.district);
          setProvince(user.province);
          setHeight(user.height);
          setWeight(user.weight);
          setBloodGroup(user.blood);
          setbday(user.bday);
        }
      });
      //calculating age
      const today = new Date();
      const birthDate = new Date(bday);
      const ageDifference = today - birthDate; // Calculate the difference in milliseconds
      const calculatedAge = Math.floor(
        // Convert the difference to years
        ageDifference / (365.25 * 24 * 60 * 60 * 1000)
      );

      setAge(calculatedAge);

      setShowViewModal(true);
      setUid(null);
    }
  }, [uid]);

  //Function to handle view button
  const handleViewClick = (report) => {
    setUid(report.uid);
    setReportType(report.reportType);
    setReportSentDate(report.Date);
    setReportSentTime(report.time);
  };

  //Function to hadle remove button
  const handleRemoveClick = (report) => {
    const user = report.userName;
    const repType = report.reportType;
    const date = report.Date;
    const time = report.time;

    const reportRef = ref(db, `userReports/${user}_${repType}_${date}_${time}`);

    // Remove the report-type from Firebase database
    remove(reportRef)
      .then(() => {
        setShowReportRemoveSuccessModal(true);
      })
      .catch((error) => {
        console.error("Error removing report:", error);
        setShowReportRemoveUnsuccessModal(true);
      });
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("", {
      id: "No",
      cell: (info) => <span>{info.row.index + 1}</span>,
      header: "No",
    }),
    columnHelper.accessor("userName", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "User",
    }),
    columnHelper.accessor("time", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Time",
    }),
    columnHelper.accessor("Date", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Date",
    }),
    columnHelper.accessor("note", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Note",
    }),
    columnHelper.accessor("", {
      header: "Action",
      cell: (info) => (
        <div className="flex items-center justify-center">
          <button
            className="bg-blue text-white active:bg-black font-semibold uppercase text-sm px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            onClick={() => handleViewClick(info.row.original)}
          >
            View
          </button>
          <button
            className="bg-red-2 text-white active:bg-black font-semibold uppercase text-sm px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            onClick={() => handleRemoveClick(info.row.original)}
          >
            Remove
          </button>
        </div>
      ),
    }),
  ];
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: reportData,
    columns,
    state: {
      globalFilter,
    },
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

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
            <DownloadBtn data={reportData} fileName={"UserReport"} />
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
          </div>
        </div>
        <div className="flex items-center justify-center w-full h-4/6 max-h-[450px] overflow-y-auto p-3 rounded">
          <UserReportTable tableName={table} />
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

      {/**view modal */}
      {showViewModal ? (
        <div>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-primary-blue dark:text-white">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="p-2 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-ternary-blue dark:bg-dark-secondary dark:border-2 dark:border-dark-ternary outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-1 rounded-t">
                  <h3 className="text-xl font-semibold">Report Info</h3>
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
                <div className="bg-secondary-blue bg-opacity-25 dark:bg-dark-primary dark:bg-opacity-55  w-full h-full p-3">
                  {/* upper part */}
                  <div className="flex p-1">
                    <div className="h-full w-1/2 p-2">
                      <div className="flex items-center justify-center ">
                        <img
                          className="rounded-full border-4 border-white drop-shadow-lg w-1/2 h-1/2 object-cover"
                          src={userPropic}
                          alt="proPic"
                        />
                      </div>
                      <p className="h-1/4 w-full font-md p-2  text-center font-inter font-semibold text-2xl">
                        {userName}
                      </p>
                      <p className="h-1/4 w-full font-md p-2  text-center font-inter text-sm">
                        {age} years old
                      </p>
                    </div>
                    <div className="h-full w-1/2 p-2 font-inter">
                      <div className="w-full h-1/2 text-sm">
                        <p className="font-bold text-lg pb-3">
                          Contact Details:
                        </p>
                        <p className="h-full w-full">
                          <FontAwesomeIcon icon={faPhoneVolume} />
                          &nbsp;&nbsp;&nbsp;{tele}
                        </p>
                        <p className="h-full w-full">
                          <FontAwesomeIcon icon={faEnvelope} />
                          &nbsp;&nbsp;&nbsp;{email}
                        </p>
                        <p className="h-full w-full">
                          <FontAwesomeIcon icon={faLocationDot} />
                          &nbsp;&nbsp;&nbsp;{address},&nbsp;
                          {district} district,&nbsp;{province}{" "}
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
                          &nbsp;&nbsp;&nbsp;{height} ft
                        </p>
                        <p className="h-full w-full">
                          <FontAwesomeIcon icon={faWeightScale} />
                          &nbsp;&nbsp;&nbsp;{weight} Kg
                        </p>
                        <p className="h-full w-full">
                          <FontAwesomeIcon icon={faDroplet} />
                          &nbsp;&nbsp;&nbsp;{bloodGroup} Blood
                        </p>
                      </div>
                      <p>&nbsp;</p>
                      <div className="w-full h-1/2 text-sm">
                        <p className="font-bold text-lg pb-3">
                          Report Details:
                        </p>
                        <p className="h-full w-full">
                          - Report type:&nbsp;&nbsp;&nbsp;{reportType}
                        </p>
                        <p className="h-full w-full">
                          - Sent date:&nbsp;&nbsp;&nbsp;{reportSentDate}
                        </p>
                        <p className="h-full w-full">
                          - Sent time:&nbsp;&nbsp;&nbsp;{reportSentTime}
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

      {/**Report-type remove success modal */}
      {showReportRemoveSuccessModal ? (
        <NotificationModal
          show={showReportRemoveSuccessModal}
          onClose={() => {
            setShowReportRemoveSuccessModal(false);
          }}
          title="Notification"
          body="Report Removed! 🤔"
          color="red"
        />
      ) : null}

      {/**Report-type remove unsuccess modal */}
      {showReportRemoveUnsuccessModal ? (
        <NotificationModal
          show={showReportRemoveUnsuccessModal}
          onClose={() => {
            setShowReportRemoveUnsuccessModal(false);
          }}
          title="Notification"
          body="Report Removal Unsuccessfull! 🤗"
          color="red"
        />
      ) : null}
    </>
  );
}

export default UserReports;
