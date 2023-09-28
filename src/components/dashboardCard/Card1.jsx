import React, { useState, useEffect } from "react";

const Card = (props) => {
  const { color, title, count } = props;
  const [initialCount, setInitialCount] = useState(1);

  useEffect(() => {
    const animationDuration = 1000; // 1 second
    let startTime;

    function animateCount(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;

      if (elapsedTime < animationDuration) {
        const progress = elapsedTime / animationDuration;
        setInitialCount(Math.min(count, Math.floor(progress * count)));
        requestAnimationFrame(animateCount);
      } else {
        setInitialCount(count);
      }
    }

    requestAnimationFrame(animateCount);

    return () => {
      startTime = null;
    };
  }, [count]);

  return (
    <div
      className={`${
        color === "blue"
          ? "bg-blue1 dark:bg-black dark:bg-opacity-70"
          : color === "green"
          ? "bg-green dark:bg-black dark:bg-opacity-70"
          : color === "orange"
          ? "bg-orange dark:bg-black dark:bg-opacity-70"
          : "bg-blue dark:bg-black dark:bg-opacity-70"
      } h-5/6 w-full rounded-md shadow hover:shadow-xl border-2 font-inter text-ternary-blue dark:text-primary-blue dark:border-secondary-blue dark:hover:shadow-md dark:shadow-secondary-blue dark:hover:shadow-ternary-blue`}
    >
      <div className="flex items-center justify-center h-1/5 w-full p-1">
        <h1 className="text-[13px] text-center">{title}</h1>
      </div>
      <div className="flex items-center justify-center h-3/5 w-full p-1">
        <h1 className="text-[60px] font-semibold">{initialCount}</h1>
      </div>
      <div className="flex items-center justify-center h-1/5 w-full p-1"></div>
    </div>
  );
};

export default Card;

