import * as XLSX from "xlsx/xlsx.mjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";

const DownloadBtn = ({ data = [], fileName }) => {
  return (
    <button
      className="p-2 border border-ternary-blue text-ternary-blue text-lg rounded shadow-md hover:shadow-lg hover:text-white hover:border-white dark:text-gray2 dark:border-gray2 dark:shadow-black dark:hover:text-gray1 dark:hover:border-gray1"
      onClick={() => {
        const datas = data?.length ? data : [];
        const worksheet = XLSX.utils.json_to_sheet(datas);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, fileName ? `${fileName}.xlsx` : "data.xlsx");
      }}
    >
      <FontAwesomeIcon icon={faFileArrowDown} />
    </button>
  );
};

export default DownloadBtn;
