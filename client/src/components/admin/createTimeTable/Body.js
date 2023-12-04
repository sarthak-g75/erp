// YourReactComponent.js

import React, { useEffect, useState } from 'react'
import EngineeringIcon from '@mui/icons-material/Engineering'
import { useDispatch, useSelector } from 'react-redux'
import { createTimeTable } from '../../../redux/actions/adminActions'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Spinner from '../../../utils/Spinner'
import * as classes from '../../../utils/styles'
import { CREATE_TIME_TABLE, SET_ERRORS } from '../../../redux/actionTypes'

const Body = () => {
  const dispatch = useDispatch()
  const store = useSelector((state) => state)
  const departments = useSelector((state) => state.admin.allDepartment)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState({})
  const [value, setValue] = useState({
    department: '',
    year: 1,
    // ... Your other form input fields
  })

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors)
      setLoading(false) // Set loading to false on error
      setValue({ department: '', year: 1 /* ...other fields */ })
    }
  }, [store.errors])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError({})
    setLoading(true)
    dispatch(createTimeTable(value))
  }

  useEffect(() => {
    if (store.errors || store.admin.timeTableCreated) {
      setLoading(false)
      if (store.admin.timeTableCreated) {
        setLoading(false)

        setValue({ department: '', year: 1 /* ...other fields */ })
        dispatch({ type: CREATE_TIME_TABLE, payload: false })
        dispatch({ type: SET_ERRORS, payload: {} })
      }
    } else {
      setLoading(true)
    }
  }, [store.errors, store.admin.timeTableCreated])

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} })
  }, [])

  return (
    <div className='flex-[0.8] mt-3'>
      <div className='space-y-5'>
        <div className='flex items-center space-x-2 text-gray-400'>
          <EngineeringIcon />
          <h1>Create TimeTable</h1>
        </div>
        <div className='flex flex-col mr-10 bg-white rounded-xl '>
          <form
            className={classes.adminForm0}
            onSubmit={handleSubmit}
          >
            <div className={classes.adminForm1}>
              <div className={classes.adminForm2l}>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Department :</h1>
                  <Select
                    required
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
                </div>

                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Year :</h1>
                  <Select
                    required
                    value={value.year}
                    onChange={(e) =>
                      setValue({ ...value, year: e.target.value })
                    }
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                  </Select>
                </div>

                {/* Your other form fields */}
              </div>
              {/* Your other form fields */}
            </div>
            <div className={classes.adminFormButton}>
              <button
                className={classes.adminFormSubmitButton}
                type='submit'
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setValue({ department: '', year: 1 /* ...other fields */ })
                  setError({})
                }}
                className={classes.adminFormClearButton}
                type='button'
              >
                Clear
              </button>
            </div>
            <div className={classes.loadingAndError}>
              {loading && (
                <Spinner
                  message='Creating TimeTable'
                  height={30}
                  width={150}
                  color='#111111'
                  messageColor='blue'
                />
              )}
              {(error.timeTableError || error.backendError) && (
                <p className='text-red-500'>
                  {error.timeTableError || error.backendError}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Body
