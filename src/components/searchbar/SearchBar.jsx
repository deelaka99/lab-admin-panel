import React from 'react'

function SearchBar() {
    return (
        <div className="flex items-center">
            <div className="flex rounded">
                <input
                    type="text"
                    className="shadow-md placeholder:text-primary-blue font-inter font-regular block w-full px-4 py-2 text-primary-blue bg-ternary-blue border border-primary-blue rounded-md focus:border-secondary-blue focus:ring-ternary-blue focus:outline-none focus:ring focus:ring-opacity-40 dark:bg-dark-ternary dark:text-gray2 dark:placeholder:text-gray2 dark:border-gray2 dark:focus:border-gray1 dark:focus:ring-primary-blue dark:focus:ring-opacity-30 dark:shadow-black"
                    placeholder="Search..."
                />
                <p>&nbsp;</p>
                <button className="shadow-md px-4 text-ternary-blue bg-primary-blue border border-ternary-blue hover:shadow-lg hover:text-white rounded dark:bg-black dark:bg-opacity-50 dark:border-gray2 dark:text-gray2 dark:shadow-black dark:hover:text-gray1 dark:hover:border-gray1">
                    Search
                </button>
            </div>
        </div>
    );
}

export default SearchBar
