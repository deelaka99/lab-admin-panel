import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { ref, onValue } from "firebase/database";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import CompanyPaymentTable from "../tables/CompanyPaymentTable";
import DownloadBtn from "../tables/sampleTable/DownloadBtn";
import DebouncedInput from "../tables/sampleTable/DebouncedInput";

function PaymentHistory() {
  const currentLabOpUID = auth.currentUser.uid;
  const [companyPaymentData, setCompanyPaymentData] = useState([]);

  // useEffect hook to fetch data from Firebase
  useEffect(() => {
    const comPayRef = ref(db, `payments/labPayments/${currentLabOpUID}`);
    onValue(comPayRef, (snapshot) => {
      const comPayData = [];
      snapshot.forEach((childSnapshot) => {
        const comPay = childSnapshot.val();
        comPayData.push(comPay);
      });
      setCompanyPaymentData(comPayData);
    });
  }, []);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("", {
      id: "No",
      cell: (info) => <span>{info.row.index + 1}</span>,
      header: "No",
    }),
    columnHelper.accessor("paymentMethod", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Payment Method",
    }),
    columnHelper.accessor("month", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Payment Month",
    }),
    columnHelper.accessor("paymentDate", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Payment Date",
    }),
    columnHelper.accessor("paymentTime", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Payment Time",
    }),
    columnHelper.accessor("amount", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Amount (Rs.)",
    }),
  ];
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: companyPaymentData,
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
            <DownloadBtn
              data={companyPaymentData}
              fileName={"companyPayments"}
            />
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
          </div>
        </div>
        <div className="flex items-center justify-center w-full h-4/6 max-h-[450px] overflow-y-auto p-3 rounded">
          <CompanyPaymentTable tableName={table} />
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
    </>
  );
}

export default PaymentHistory;
