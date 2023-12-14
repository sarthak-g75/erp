// YourReactComponent.js

import React, { useEffect, useState } from 'react'
import EngineeringIcon from '@mui/icons-material/Engineering'
import { useDispatch, useSelector } from 'react-redux'
import { getTimeTable } from '../../../redux/actions/adminActions'
import { MenuItem, Select } from '@mui/material'
import Spinner from '../../../utils/Spinner'
import { SET_ERRORS } from '../../../redux/actionTypes'
import * as classes from '../../../utils/styles'

const Body = () => {
  const dispatch = useDispatch()
  const [error, setError] = useState({})
  const departments = useSelector((state) => state.admin.allDepartment)
  const [loading, setLoading] = useState(false)
  const store = useSelector((state) => state)
  const [search, setSearch] = useState(false)
  const [value, setValue] = useState({
    department: '',
    year: '',
  })
  // console.log(departments)
  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors)
      setLoading(false)
    }
  }, [store.errors])

  const handleSubmit = (e) => {
    // test(value)
    e.preventDefault()
    setSearch(true)
    setLoading(true)
    setError({})
    // console.log(value)
    dispatch(getTimeTable(value))
  }

  const timetable = useSelector((state) => state.admin.timeTables.result)
  // console.log(timetable)
  // console.log(timetable)

  useEffect(() => {
    if (timetable?.length !== 0) {
      setLoading(false)
    }
    // console.log(timetable)
  }, [timetable])

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} })
  }, [])

  return (
    <div className='flex-[0.8] mt-3'>
      <div className='space-y-5'>
        <div className='flex items-center space-x-2 text-gray-400'>
          <EngineeringIcon />
          <h1>View Timetable</h1>
        </div>
        <div className=' mr-10 bg-white grid grid-cols-4 rounded-xl pt-6 pl-6 h-[29.5rem]'>
          <form
            className='flex flex-col col-span-1 space-y-2'
            onSubmit={handleSubmit}
          >
            <label htmlFor='department'>Department</label>
            <Select
              required
              displayEmpty
              sx={{ height: 36, width: 224 }}
              inputProps={{ 'aria-label': 'Without label' }}
              value={value.department}
              onChange={(e) =>
                setValue({ ...value, department: e.target.value })
              }
            >
              <MenuItem value=''>None</MenuItem>
              {departments?.map((dp, idx) => (
                <MenuItem
                  key={idx}
                  value={dp.department}
                >
                  {dp.department}
                </MenuItem>
              ))}
            </Select>
            <label htmlFor='year'>Year</label>
            <Select
              required
              displayEmpty
              sx={{ height: 36, width: 224 }}
              inputProps={{ 'aria-label': 'Without label' }}
              value={value.year}
              onChange={(e) => setValue({ ...value, year: e.target.value })}
            >
              <MenuItem value=''>None</MenuItem>
              <MenuItem value={'1'}>1</MenuItem>
              <MenuItem value={'2'}>2</MenuItem>
              <MenuItem value={'3'}>3</MenuItem>
              <MenuItem value={'4'}>4</MenuItem>
            </Select>
            <button
              className={`${classes.adminFormSubmitButton} w-56`}
              type='submit'
            >
              Search
            </button>
          </form>

          <div className='col-span-3 mr-6'>
            <div className={classes.loadingAndError}>
              {loading && (
                <Spinner
                  message='Loading Timetable'
                  height={50}
                  width={150}
                  color='#111111'
                  messageColor='blue'
                />
              )}
              {(error.noTimetableError || error.backendError) && (
                <p className='text-2xl font-bold text-red-500'>
                  {error.noTimetableError || error.backendError}
                </p>
              )}
            </div>
            {search &&
              !loading &&
              Object.keys(error).length === 0 &&
              timetable?.length !== 0 && (
                <div className={classes.adminData}>
                  {/* Render your timetable here based on the 'timetable' state */}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Body
