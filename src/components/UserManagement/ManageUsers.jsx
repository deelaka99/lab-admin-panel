import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { update, remove, ref, onValue } from "firebase/database";
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
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

function ManageUsers() {
  const [userData, setUserData] = useState([]);

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
      console.log("Fetched data from Firebase:", userData);
    });
  }, []);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("", {
      id: "U.No",
      cell: (info) => <span>{info.row.index + 1}</span>,
      header: "U.No",
    }),
    columnHelper.accessor("proPic", {
      cell: (info) => (
        <img
          src={info?.getValue()}
          alt="proPic"
          className="rounded-full border w-10 h-10 object-cover"
        />
      ),
      header: "Profile Pic",
    }),
    columnHelper.accessor("userName", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Name",
    }),
    columnHelper.accessor("address", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Address",
    }),
    columnHelper.accessor("telephone", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Telephone",
    }),
    columnHelper.accessor("email", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Email",
    }),
    columnHelper.accessor("", {
      header: "Action",
    }),
  ];
  const [data] = useState(() => [...userData]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data:userData,
    columns,
    state: {
      globalFilter,
    },
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
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
          <DownloadBtn data={data} fileName={"users"} />
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
          <button className="p-2 border border-ternary-blue font-inter bg-primary-blue text-ternary-blue text-lg rounded shadow-md hover:shadow-lg hover:text-white hover:border-white dark:bg-black dark:bg-opacity-50 dark:text-gray2 dark:border-gray2 dark:shadow-black dark:hover:text-gray1 dark:hover:border-gray1">
            <FontAwesomeIcon icon={faUserPlus} />
            &nbsp;&nbsp;Add New User
          </button>
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
  );
}

export default ManageUsers;
