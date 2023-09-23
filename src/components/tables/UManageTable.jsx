import {
  flexRender,
} from "@tanstack/react-table";

const UManageTable = (props) => {
  const { tableName } = props;

  return (
    <div className="h-full w-full rounded">
      <table className="border border-ternary-blue w-full h-full text-center dark:border-gray2">
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
                  ${i % 2 === 0 ? "bg-primary-blue bg-opacity-50 dark:bg-dark-secondary dark:bg-opacity-80 " : "bg-secondary-blue bg-opacity-30 dark:bg-dark-primary  dark:bg-opacity-80"}
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
              <td colSpan={12}>No Records Found!</td>
            </tr>
          )}
        </tbody>
      </table>      
    </div>
  );
};

export default UManageTable;
