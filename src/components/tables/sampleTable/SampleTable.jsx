import {
  flexRender,
} from "@tanstack/react-table";

const TanStackTable = (props) => {
  const { tableName } = props;

  return (
    <div className="bg-green h-full w-full rounded">
      <table className="border border-ternary-blue w-full text-left">
        <thead className="bg-ternary-blue text-primary-blue">
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
        <tbody className="text-ternary-blue bg-primary-blue">
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
