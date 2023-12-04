import express from 'express'
import multer from 'multer'
import path from 'path'
import bodyParser from 'body-parser'

import auth from '../middleware/auth.js'

import {
  adminLogin,
  updateAdmin,
  addAdmin,
  addFaculty,
  getFaculty,
  addSubject,
  getSubject,
  addStudent,
  getStudent,
  addDepartment,
  getAllStudent,
  getAllFaculty,
  getAllAdmin,
  getAllDepartment,
  getAllSubject,
  updatedPassword,
  getAdmin,
  deleteAdmin,
  deleteDepartment,
  deleteFaculty,
  deleteStudent,
  deleteSubject,
  createNotice,
  getNotice,
  newAdmin,
  createTimeTable,
  deleteTimeTable,
  getTimeTable,
  addAllStudents,
} from '../controller/adminController.js'
const router = express.Router()

router.use(bodyParser.urlencoded({ extended: true }))
router.use(express.static(path.resolve(process.cwd(), 'public')))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(process.cwd(), 'public/uploads'))
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

router.post('/addAllStudents', upload.single('file'), addAllStudents)
router.post('/createTimeTable', createTimeTable)
router.delete('/deleteTimeTable', deleteTimeTable)
router.get('/getTimeTable', getTimeTable)

router.post('/login', adminLogin)
router.post('/newadmin', newAdmin)
router.post('/updatepassword', auth, updatedPassword)
router.get('/getallstudent', auth, getAllStudent)
router.post('/createnotice', auth, createNotice)
router.get('/getallfaculty', auth, getAllFaculty)
router.get('/getalldepartment', auth, getAllDepartment)
router.get('/getallsubject', auth, getAllSubject)
router.get('/getalladmin', auth, getAllAdmin)
router.post('/updateprofile', auth, updateAdmin)
router.post('/addadmin', auth, addAdmin)
router.post('/adddepartment', auth, addDepartment)
router.post('/addfaculty', auth, addFaculty)
router.post('/getfaculty', auth, getFaculty)
router.post('/addsubject', auth, addSubject)
router.post('/getsubject', auth, getSubject)
router.post('/addstudent', auth, addStudent)
router.post('/getstudent', auth, getStudent)
router.post('/getnotice', auth, getNotice)
router.post('/getadmin', auth, getAdmin)
router.post('/deleteadmin', auth, deleteAdmin)
router.post('/deletefaculty', auth, deleteFaculty)
router.post('/deletestudent', auth, deleteStudent)
router.post('/deletedepartment', auth, deleteDepartment)
router.post('/deletesubject', auth, deleteSubject)

export default router
