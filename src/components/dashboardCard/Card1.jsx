import React from "react";

const Card = (props) => {
  const { color, title, count } = props;

  return (
    <div
      className={`${
        color === "red" ? "bg-red dark:bg-black dark:bg-opacity-70" : color === "green" ? "bg-green dark:bg-black dark:bg-opacity-70" : color==="orange"?"bg-orange dark:bg-black dark:bg-opacity-70": "bg-blue dark:bg-black dark:bg-opacity-70"
      } h-full w-full rounded-md shadow hover:shadow-xl border-2 font-inter text-ternary-blue dark:text-primary-blue dark:border-secondary-blue dark:hover:shadow-md dark:shadow-secondary-blue dark:hover:shadow-ternary-blue`}
    >
      <div className="flex items-center justify-center h-1/5 w-full p-1">
        <h1 className="text-[13px]">{title}</h1>
      </div>
      <div className="flex items-center justify-center h-3/5 w-full p-1">
        <h1 className="text-[50px] ">{count}</h1>
      </div>
      <div className="flex items-center justify-center h-1/5 w-full p-1">
        <h1 className="hover:font-semibold text-[13px]">View</h1>
      </div>
    </div>
  );
};

export default Card;
