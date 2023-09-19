import React from "react";

const Card = (props) => {
  const { color, title, count } = props;

  return (
    <div
      className={`${
        color === "blue" ? "bg-blue1 dark:bg-black dark:bg-opacity-70" : color === "green" ? "bg-green dark:bg-black dark:bg-opacity-70" : color==="orange"?"bg-orange dark:bg-black dark:bg-opacity-70": "bg-red dark:bg-black dark:bg-opacity-70"
      } h-full w-1/4 rounded-md shadow hover:shadow-xl border-2 font-inter text-ternary-blue dark:text-primary-blue dark:border-secondary-blue dark:hover:shadow-md dark:shadow-secondary-blue dark:hover:shadow-ternary-blue`}
    >
      <div className="flex items-center justify-center h-1/5 w-full p-3">
        <h1>{title}</h1>
      </div>
      <div className="flex items-center justify-center h-3/5 w-full p-3">
        <h1 className="text-[90px] ">{count}</h1>
      </div>
      <div className="flex items-center justify-center h-1/5 w-full p-3">
        <h1 className="hover:font-semibold">View</h1>
      </div>
    </div>
  );
};

export default Card;
