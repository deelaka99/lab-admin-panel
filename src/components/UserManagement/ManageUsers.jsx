import React from 'react';
import SearchBar from '../searchbar/SearchBar';

function ManageUsers() {
  return (
    <div className='flex flex-col w-full h-full'>
      <div className='flex w-full h-1/6'>
        <div className='flex justify-center items-center h-full w-1/2'>
          <SearchBar/>
        </div>
        <div className='bg-bermuda h-full w-1/2'></div>
      </div>
      <div className='bg-red w-full h-5/6'></div>
    </div>
  )
}

export default ManageUsers
