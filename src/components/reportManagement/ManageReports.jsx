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

import UManageTable from "../tables/UManageTable";
import DownloadBtn from "../tables/sampleTable/DownloadBtn";
import DebouncedInput from "../tables/sampleTable/DebouncedInput";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

function ManageUsers() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [reportTypeData, setReportTypeData] = useState([]); // State to store retrieved data
  const [selectedReportType, setSelectedReportType] = useState(null);

  const [
    showReportTypeUpdateSuccessModal,
    setShowReportTypeUpdateSuccessModal,
  ] = useState(false);
  const [
    showReportTypeUpdateUnsuccessModal,
    setShowReportTypeUpdateUnsuccessModal,
  ] = useState(false);
  const [
    showReportTypeRemoveSuccessModal,
    setShowReportTypeRemoveSuccessModal,
  ] = useState(false);
  const [
    showReportTypeRemoveUnsuccessModal,
    setShowReportTypeRemoveUnsuccessModal,
  ] = useState(false);
  const [showReportTypeActivateModal, setShowReportTypeActivateModal] =
    useState(false);
  const [showReportTypeDeactivateModal, setShowReportTypeDeactivateModal] =
    useState(false);

  // useEffect hook to fetch data from Firebase
  useEffect(() => {
    const reportTypeRef = ref(db, "reportTypes");
    onValue(reportTypeRef, (snapshot) => {
      const reportTypeData = [];
      snapshot.forEach((childSnapshot) => {
        const reportType = childSnapshot.val();
        reportTypeData.push(reportType);
      });
      setReportTypeData(reportTypeData);
    });
  }, []);

  // user update function
  const updateReportTypeData = () => {
    const reportTypeRef = ref(db, `reportTypes/${selectedReportType.typeName}`);
    const updates = {
      typeName: selectedReportType.typeName,
      metric1: selectedReportType.metric1,
      metric2: selectedReportType.metric2,
      metric3: selectedReportType.metric3,
      metric4: selectedReportType.metric4,
      metricVal1: selectedReportType.metricVal1,
      metricVal2: selectedReportType.metricVal2,
      metricVal3: selectedReportType.metricVal3,
      metricVal4: selectedReportType.metricVal4,
    };

    // Update the data in Firebase realtime
    update(reportTypeRef, updates)
      .then(() => {
        // Data updated successfully
        console.log("Report-type data updated!");
        setShowEditModal(false); // Close the Edit modal
        setShowReportTypeUpdateSuccessModal(true);
      })
      .catch((error) => {
        console.error("Error updating report-type data:", error);
        setShowReportTypeUpdateUnsuccessModal(true);
      });
  };

  //Function to hadle remove button
  const handleRemoveClick = (typeName) => {
    const reportTypeRef = ref(db, "reportTypes/" + typeName.typeName);
    const imagePath = typeName.reportIcon;
    const imageRef = storageRef(storage, imagePath);

    // Remove the user's profile picture from Firebase Storage
    deleteObject(imageRef)
      .then(() => {
        // Image deleted successfully from Firebase Storage
        console.log("Icon deleted from Firebase Storage");
      })
      .catch((error) => {
        console.error("Error deleting Icon from Firebase Storage:", error);
      });

    // Remove the report-type from Firebase database
    remove(reportTypeRef)
      .then(() => {
        setShowReportTypeRemoveSuccessModal(true);
      })
      .catch((error) => {
        console.error("Error removing report-type:", error);
        setShowReportTypeRemoveUnsuccessModal(true);
      });
  };

  // Function to handle edit button
  const handleEditClick = (reportType) => {
    setSelectedReportType(reportType);
    setShowEditModal(true);
  };

  // Function to handle active button
  const handleToggleActive = (reportType) => {
    const reportTypeRef = ref(db, "reportTypes/" + reportType.typeName);
    // Update the active status of the report-type in Firebase
    const updatedActiveStatus = !reportType.activeStatus;
    const updates = {
      activeStatus: updatedActiveStatus,
    };

    // Update the data in Firebase
    update(reportTypeRef, updates)
      .then(() => {
        // Data updated successfully
        console.log(
          "Report-type active statues:",
          reportType.typeName,
          updatedActiveStatus ? "Activated" : "Deactivated"
        );
        //showing activated modal success or not
        updatedActiveStatus
          ? setShowReportTypeActivateModal(true)
          : setShowReportTypeDeactivateModal(true);
      })
      .catch((error) => {
        console.error("Error activating report-type:", error);
      });
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("", {
      id: "No",
      cell: (info) => <span>{info.row.index + 1}</span>,
      header: "No",
    }),
    columnHelper.accessor("reportIcon", {
      cell: (info) => (
        <img
          src={info?.getValue()}
          alt="reportIcon"
          className="rounded-full border w-10 h-10 object-cover"
        />
      ),
      header: "Icon",
    }),
    columnHelper.accessor("typeName", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Report Type",
    }),
    columnHelper.accessor("metric1", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Metric_1",
    }),
    columnHelper.accessor("metric2", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Metric_2",
    }),
    columnHelper.accessor("metric3", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Metric_3",
    }),
    columnHelper.accessor("metric4", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Metric_4",
    }),
    columnHelper.accessor("", {
      header: "Action",
      cell: (info) => (
        <div className="flex items-center">
          <button
            className="bg-blue text-white active:bg-black font-semibold uppercase text-sm px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            onClick={() => handleEditClick(info.row.original)}
          >
            Edit
          </button>
          <button
            className={`bg-${
              info.row.original.activeStatus ? "yellow" : "green"
            } text-${
              info.row.original.activeStatus ? "black" : "white"
            } active:bg-black font-semibold uppercase text-sm px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
            onClick={() => handleToggleActive(info.row.original)}
          >
            {info.row.original.activeStatus ? "Deactivate" : "Activate"}
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
    data: reportTypeData,
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
            <DownloadBtn data={reportTypeData} fileName={"reportTypes"} />
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
          </div>
        </div>
        <div className="flex items-center justify-center w-full h-4/6 max-h-[450px] overflow-y-auto p-3 rounded">
          <UManageTable tableName={table} />
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
      {/**Edit modal */}
      {showEditModal ? (
        <div>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-primary-blue dark:text-white">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="p-2 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-ternary-blue dark:bg-dark-secondary dark:border-2 dark:border-dark-ternary outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-1 rounded-t">
                  <h3 className="text-xl font-semibold">Edit Report-type</h3>
                  <button
                    className=" ml-auto  border-0 text-primary-blue font-semibold active:text-black"
                    onClick={() => setShowEditModal(false)}
                  >
                    <span className=" text-primary-blue drop-shadow-lg shadow-black h-6 w-6 text-3xl block dark:text-white flex items-center justify-center">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-2 flex flex-col">
                  <form>
                    <div className="h-1/5 w-full flex flex-col">
                      <div className="">
                        <p className="font-semibold">Type Name :</p>
                      </div>
                      <div className="pt-2 pb-2">
                        <input
                          type="text"
                          placeholder="Enter new Lab name"
                          className="rounded-full p-2 h-3/5 w-full bg-white border-primary-blue border-2 text-center font-semibold dark:border-dark-ternary dark:bg-dark-ternary active:bg-secondary-blue dark:active:bg-dark-secondary"
                          value={selectedReportType.typeName}
                          onChange={(e) =>
                            setSelectedReportType({
                              ...selectedReportType,
                              typeName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="h-1/5 w-full flex flex-col">
                      <div>
                        <p className="font-semibold">Address :</p>
                      </div>
                      <div className="pt-2 pb-2">
                        <input
                          type="text"
                          placeholder="Enter new Address"
                          className="rounded-full p-2 h-3/5 w-full bg-white border-primary-blue border-2 text-center font-semibold dark:border-dark-ternary dark:bg-dark-ternary active:bg-secondary-blue dark:active:bg-dark-secondary"
                          value={selectedReportType.typeName}
                          onChange={(e) =>
                            setSelectedReportType({
                              ...selectedReportType,
                              typeName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="h-1/5 w-full flex flex-col">
                      <div>
                        <p className="font-semibold">District :</p>
                      </div>
                      <div className="pt-2 pb-2">
                        <input
                          type="text"
                          placeholder="Enter new E-mail"
                          className="rounded-full p-2 h-3/5 w-full bg-white border-primary-blue border-2 text-center font-semibold dark:border-dark-ternary dark:bg-dark-ternary active:bg-secondary-blue dark:active:bg-dark-secondary"
                          value={selectedReportType.typeName}
                          onChange={(e) =>
                            setSelectedReportType({
                              ...selectedReportType,
                              typeName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="h-1/5 w-full flex flex-col">
                      <div>
                        <p className="font-semibold">Telephone :</p>
                      </div>
                      <div className="pt-2 pb-2">
                        <input
                          type="text"
                          placeholder="Enter new Telephone"
                          className="rounded-full p-2 h-3/5 w-full bg-white border-primary-blue border-2 text-center font-semibold dark:border-dark-ternary dark:bg-dark-ternary active:bg-secondary-blue dark:active:bg-dark-secondary"
                          value={selectedReportType.typeName}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedReportType,
                              typeName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </form>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-center p-1 rounded-b">
                  <button
                    className="bg-primary-blue text-white active:bg-black font-bold uppercase text-md px-3 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 dark:bg-dark-primary"
                    type="button"
                    onClick={updateReportTypeData}
                  >
                    <FontAwesomeIcon icon={faFloppyDisk} />
                    &nbsp; Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg opacity-50 fixed inset-0 z-40 bg-black"></div>
        </div>
      ) : null}

      {/**Report-type update success modal */}
      {showReportTypeUpdateSuccessModal ? (
        <NotificationModal
          show={showReportTypeUpdateSuccessModal}
          onClose={() => {
            setShowReportTypeUpdateSuccessModal(false);
          }}
          title="Notification"
          body="Report-type Updated Successfull! 😎"
          color="green"
        />
      ) : null}

      {/**Report-type update Unsuccess modal */}
      {showReportTypeUpdateUnsuccessModal ? (
        <NotificationModal
          show={showReportTypeUpdateUnsuccessModal}
          onClose={() => {
            setShowReportTypeUpdateUnsuccessModal(false);
          }}
          title="Notification"
          body="Report-type Updated Unsuccessfull! 😥"
          color="red"
        />
      ) : null}

      {/**Report-type remove success modal */}
      {showReportTypeRemoveSuccessModal ? (
        <NotificationModal
          show={showReportTypeRemoveSuccessModal}
          onClose={() => {
            setShowReportTypeRemoveSuccessModal(false);
          }}
          title="Notification"
          body="Report-type Removed! 🤔"
          color="red"
        />
      ) : null}

      {/**Report-type remove unsuccess modal */}
      {showReportTypeRemoveUnsuccessModal ? (
        <NotificationModal
          show={showReportTypeRemoveUnsuccessModal}
          onClose={() => {
            setShowReportTypeRemoveUnsuccessModal(false);
          }}
          title="Notification"
          body="Report-type Removal Unsuccessfull! 🤗"
          color="red"
        />
      ) : null}

      {/**Report-type activate success modal */}
      {showReportTypeActivateModal ? (
        <NotificationModal
          show={showReportTypeActivateModal}
          onClose={() => {
            setShowReportTypeActivateModal(false);
          }}
          title="Notification"
          body="Report-type activated! 🤗"
          color="green"
        />
      ) : null}

      {/**Report-type deactivate success modal */}
      {showReportTypeDeactivateModal ? (
        <NotificationModal
          show={showReportTypeDeactivateModal}
          onClose={() => {
            setShowReportTypeDeactivateModal(false);
          }}
          title="Notification"
          body="Report-type deactivated! 🤔"
          color="yellow"
        />
      ) : null}
    </>
  );
}

export default ManageUsers;
