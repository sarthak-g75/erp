import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const history = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('user')

    history('/')
  }

  return (
    <nav className='z-10 flex justify-between px-3 py-2 bg-slate-300'>
      <Link
        to='/'
        className='flex items-center justify-center gap-2'
      >
        <img
          src='logo.png'
          className='w-12'
          alt='logo'
        />
        <span className='text-2xl font-bold'>CampusTrack</span>
      </Link>

      {/* <div> Student's Login</div> */}
      {!localStorage.getItem('user') ? (
        <div className='flex items-center gap-2'>
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
      ) : (
        ''
      )}
    </nav>
  )
}

export default Navbar
