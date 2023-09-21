import React from 'react'

function SearchBar() {
    return (
        <div className="flex items-center">
            <div className="flex rounded">
                <input
                    type="text"
                    className="placeholder:text-primary-blue font-inter font-regular block w-full px-4 py-2 text-primary-blue bg-ternary-blue border border-primary-blue rounded-md focus:border-secondary-blue focus:ring-ternary-blue focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Search..."
                />
                <button className="px-4 text-ternary-blue bg-primary-blue border border-ternary-blue shadow-lg rounded ">
                    Search
                </button>
            </div>
        </div>
    );
}

export default SearchBar
