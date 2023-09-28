import React, { useState, useEffect } from "react";

const Card = (props) => {
  const { color, title, count } = props;
  const [initialCount, setInitialCount] = useState(1);

  useEffect(() => {
    // Define the duration for the animation (in milliseconds)
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

    // Start the animation
    requestAnimationFrame(animateCount);

    return () => {
      // Clean up any running animations
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
          : "bg-red dark:bg-black dark:bg-opacity-70"
      } h-full w-1/4 rounded-md shadow hover:shadow-xl border-2 font-inter text-ternary-blue dark:text-primary-blue dark:border-secondary-blue dark:hover:shadow-md dark:shadow-secondary-blue dark:hover:shadow-ternary-blue`}
    >
      <div className="flex items-center justify-center h-1/4 w-full p-3">
        <h1>{title}</h1>
      </div>
      <div className="flex items-center justify-center h-3/4 w-full p-3">
        <h1 className="text-[90px] ">{initialCount}</h1>
      </div>
    </div>
  );
};

export default Card;
