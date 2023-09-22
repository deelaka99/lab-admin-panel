import { useEffect, useState } from "react";

const DebouncedInput = ({
  value: initValue,
  onChange,
  debounce = 500,
  ...props
}) => {
  const [value, setValue] = useState(initValue);
  useEffect(() => {
    setValue(initValue);
  }, [initValue]);

  // *  0.5s after set value in state
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      className="shadow-md placeholder:text-primary-blue font-inter font-regular block w-3/4 px-4 py-2 text-primary-blue bg-ternary-blue border border-primary-blue rounded-md focus:border-secondary-blue focus:ring-ternary-blue focus:outline-none focus:ring focus:ring-opacity-40 dark:bg-dark-ternary dark:text-gray2 dark:placeholder:text-gray2 dark:border-gray2 dark:focus:border-gray1 dark:focus:ring-primary-blue dark:focus:ring-opacity-30 dark:shadow-black"
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default DebouncedInput;