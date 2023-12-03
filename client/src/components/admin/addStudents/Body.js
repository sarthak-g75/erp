import React, { useEffect, useState, useRef } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { useDispatch, useSelector } from 'react-redux'
import FileBase from 'react-file-base64'
import { addAllStudents } from '../../../redux/actions/adminActions'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Spinner from '../../../utils/Spinner'
import { ADD_ALL_STUDENTS, SET_ERRORS } from '../../../redux/actionTypes'
import * as classes from '../../../utils/styles'

const Body = () => {
  const dispatch = useDispatch()
  const store = useSelector((state) => state)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState({})
  const errorRef = useRef()

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('file', value.file)

    dispatch(addAllStudents(formData))

    setError({})
    setLoading(true)
  }
  const [value, setValue] = useState({ file: null })

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors)
      errorRef.current.scrollIntoView({ behavior: 'smooth' })
      setValue({ ...value, file: null })
    }
  }, [store.errors])

  useEffect(() => {
    if (store.errors || store.admin.studentsAdded) {
      setLoading(false)

      if (store.admin.studentsAdded) {
        setValue({
          file: null,
        })

        dispatch({ type: SET_ERRORS, payload: {} })
        dispatch({ type: ADD_ALL_STUDENTS, payload: false })
      }
    } else {
      setLoading(true)
    }
  }, [store.errors, store.admin.studentsAdded])

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} })
  }, [])

  return (
    <div className=''>
      <form
        className={classes.adminForm0}
        onSubmit={handleSubmit}
      >
        <div className={classes.adminForm3}>
          <h1 className={classes.adminLabel}>CSV File:</h1>
          <input
            required
            type='file'
            accept='.csv'
            onChange={(e) => setValue({ ...value, file: e.target.files[0] })}
          />
        </div>
        <div className={classes.adminFormButton}>
          <button
            className={classes.adminFormSubmitButton}
            type='submit'
          >
            Submit
          </button>
        </div>
        <div
          ref={errorRef}
          className={classes.loadingAndError}
        >
          {loading && (
            <Spinner
              message='Adding Students'
              height={30}
              width={150}
              color='#111111'
              messageColor='blue'
            />
          )}
          {(error.emailError || error.backendError) && (
            <p className='text-red-500'>
              {error.emailError || error.backendError}
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default Body
