import express from 'express'
import {
  studentLogin,
  updatedPassword,
  updateStudent,
  testResult,
  attendance,
} from '../controller/studentController.js'

import { getTimeTable } from '../controller/adminController.js'
import auth from '../middleware/auth.js'

const router = express.Router()
router.get('/getTimeTable', getTimeTable)

router.post('/login', studentLogin)
router.post('/updatepassword', updatedPassword)
router.post('/updateprofile', updateStudent)
router.post('/testresult', testResult)
router.post('/attendance', attendance)

export default router
