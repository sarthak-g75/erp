import React from 'react'
import { Link } from 'react-router-dom'
const Login = () => {
  return (
    <>
      <div className='absolute top-0 min-w-full min-h-screen -z-10 bg-slate-200'></div>
      <div className='flex items-center gap-8 px-48 py-24 h-[80vh] justify-evenly '>
        <div className='flex flex-col gap-10'>
          <div className='flex flex-col gap-2'>
            <div className='text-6xl font-bold'>Welcome to CampusTrack,</div>
            <div className='text-2xl font-medium text-slate-700 opacity-70'>
              Navigating Education's Path with Seamless Efficiency.
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <Link
              type='button'
              to='/login/studentlogin'
              className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
            >
              Student's Login
            </Link>
            <Link
              type='button'
              to='/login/facultylogin'
              className='py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
            >
              Factulty's Login
            </Link>
          </div>
        </div>
        <img
          src='students.jpg'
          alt='students photo'
          className='w-[50vh] h-[50vh] object-contain mix-blend-multiply'
        />
      </div>
    </>
  )
}

export default Login
