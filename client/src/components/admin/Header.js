import React from 'react'
import { Avatar } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
const Header = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const logout = () => {
    dispatch({ type: 'LOGOUT' })
    navigate('/login/adminLogin')
    localStorage.removeItem('user')
  }
  return (
    <div className='flex-[0.05] flex justify-between items-center mx-5 my-2'>
      <h1 className='font-semibold text-black'>Welcome</h1>
      <div className='flex items-center space-x-3'>
        <Avatar
          src={user.result.avatar}
          alt={user.result.name.charAt(0)}
          sx={{ width: 24, height: 24 }}
          className='border-2 border-blue-600'
        />
        <h1>{user.result.name.split(' ')[0]}</h1>
        <LogoutIcon
          onClick={logout}
          className='text-red-600 transition-all cursor-pointer hover:scale-125'
        />
      </div>
    </div>
  )
}

export default Header
