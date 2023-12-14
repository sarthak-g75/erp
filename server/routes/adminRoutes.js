import express from 'express'
import multer from 'multer'
import path from 'path'
import bodyParser from 'body-parser'

// import auth from '../middleware/auth.js'

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
  getAllTimeTable,
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
router.get('/getAllTimeTable', getAllTimeTable)

router.post('/login', adminLogin)
router.post('/newadmin', newAdmin)
router.post('/updatepassword', updatedPassword)
router.get('/getallstudent', getAllStudent)
router.post('/createnotice', createNotice)
router.get('/getallfaculty', getAllFaculty)
router.get('/getalldepartment', getAllDepartment)
router.get('/getallsubject', getAllSubject)
router.get('/getalladmin', getAllAdmin)
router.post('/updateprofile', updateAdmin)
router.post('/addadmin', addAdmin)
router.post('/adddepartment', addDepartment)
router.post('/addfaculty', addFaculty)
router.post('/getfaculty', getFaculty)
router.post('/addsubject', addSubject)
router.post('/getsubject', getSubject)
router.post('/addstudent', addStudent)
router.post('/getstudent', getStudent)
router.post('/getnotice', getNotice)
router.post('/getadmin', getAdmin)
router.post('/deleteadmin', deleteAdmin)
router.post('/deletefaculty', deleteFaculty)
router.post('/deletestudent', deleteStudent)
router.post('/deletedepartment', deleteDepartment)
router.post('/deletesubject', deleteSubject)

export default router
