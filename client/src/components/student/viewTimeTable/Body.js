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
  const [loading, setLoading] = useState(false)
  const store = useSelector((state) => state)
  const [search, setSearch] = useState(false)

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

  const renderEntries = (entries) => {
    return entries.map((entry) => (
      <td
        key={entry._id}
        className='p-2 border'
      >
        <p className='font-bold'>{entry.subject}</p>
      </td>
    ))
  }

  const renderTimetable = () => {
    if (!timetable.entries || !Array.isArray(timetable.entries)) {
      return <p>No timetable data available.</p>
    }

    return (
      <table className='w-full border border-collapse table-auto'>
        <thead>
          <tr>
            <th className='p-2 border'></th>
            <th className='p-2 border'>9-10</th>
            <th className='p-2 border'>10-11</th>
            <th className='p-2 border'>11-12</th>
            <th className='p-2 border'>12-1</th>
            <th className='p-2 border'>1-2</th>
            {/* <th className='p-2 border'>2-3</th> */}
            {/* Add more time slots as needed */}
          </tr>
        </thead>
        <tbody>
          {timetable.entries.map((dayEntry) => (
            <tr
              key={dayEntry._id}
              className='border'
            >
              <td className='p-2'>
                <strong> {days[dayEntry.day]}</strong>
              </td>
              {renderEntries(dayEntry.entry)}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors)
      setLoading(false)
    }
  }, [store.errors])

  const timetable = useSelector((state) => state.admin.timeTables)

  useEffect(() => {
    if (timetable?.length !== 0) {
      setLoading(false)
    }
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
          <div className='col-span-3 mr-6'>
            <div className={classes.loadingAndError}></div>

            <div className='mt-6'>
              <div className='p-6 bg-white rounded-lg shadow-md'>
                <h2 className='mb-2 text-2xl font-bold'>
                  Timetable for Year {timetable.year}
                </h2>
                <h3 className='mb-4 text-lg font-semibold'>
                  Department: {timetable.department}
                </h3>
                <h4 className='mb-4 text-base font-semibold'>
                  Section: {timetable.section}
                </h4>
                {/* Render the timetable */}
                {renderTimetable()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Body
