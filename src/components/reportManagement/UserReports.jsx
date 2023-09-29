import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase";
import { update, remove, ref, onValue } from "firebase/database";
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
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

function UserReports() {
  const [reportData, setReportData] = useState([]); // State to store retrieved data
  const [selectedReport, setSelectedReport] = useState(null);

  const [showReportRemoveSuccessModal, setShowReportRemoveSuccessModal] =
    useState(false);
  const [showReportRemoveUnsuccessModal, setShowReportRemoveUnsuccessModal] =
    useState(false);

  // useEffect hook to fetch data from Firebase
  useEffect(() => {
    const reportRef = ref(db, "userReports");
    onValue(reportRef, (snapshot) => {
      const reportData = [];
      snapshot.forEach((childSnapshot) => {
        const report = childSnapshot.val();
        reportData.push(report);
      });
      setReportData(reportData);
    });
  }, []);

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
        <div className="flex items-center">
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
            <DownloadBtn data={reportData} fileName={"reportTypes"} />
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
