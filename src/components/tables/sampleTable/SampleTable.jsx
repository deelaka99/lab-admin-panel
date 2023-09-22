import { flexRender } from "@tanstack/react-table";
import {useEffect} from "react";

const TanStackTable = (props) => {
  const { tableName } = props;

//   // Function to update the width of the header cells to match the body cells
//   const updateHeaderCellWidths = () => {
//     const headerCells = tableRef.current.querySelectorAll("thead th");
//     const bodyCells = tableRef.current.querySelectorAll("tbody td");
// 
//     headerCells.forEach((headerCell, index) => {
//       const bodyCell = bodyCells[index];
//       headerCell.style.width = `${bodyCell.clientWidth}px`;
//     });
//   };
// 
//   // Call the updateHeaderCellWidths function initially and whenever the table changes
//   useEffect(() => {
//     updateHeaderCellWidths();
//     window.addEventListener("resize", updateHeaderCellWidths);
//     return () => {
//       window.removeEventListener("resize", updateHeaderCellWidths);
//     };
//   }, []);

  return (
    <div className="bg-green h-full w-full rounded">
      <table className="border border-ternary-blue w-full h-full text-left dark:border-gray2">
        <thead className="bg-ternary-blue text-primary-blue dark:bg-dark-primary dark:text-gray2">
          {tableName.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="capitalize px-3.5 py-2">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="text-ternary-blue bg-primary-blue dark:bg-dark-ternary dark:text-gray1">
          {tableName.getRowModel().rows.length ? (
            tableName.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                className={`
                  ${i % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                  `}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3.5 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr className="text-center h-32">
              <td colSpan={12}>No Recoard Found!</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TanStackTable;
