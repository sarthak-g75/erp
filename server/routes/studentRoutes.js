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
router.post('/updatepassword', auth, updatedPassword)
router.post('/updateprofile', auth, updateStudent)
router.post('/testresult', auth, testResult)
router.post('/attendance', auth, attendance)

export default router
