import Admin from '../models/admin.js'
import Department from '../models/department.js'
import TimeTable from '../models/timeTable.js'
import Faculty from '../models/faculty.js'
import Student from '../models/student.js'
import Subject from '../models/subject.js'
import Notice from '../models/notice.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import csvtojson from 'csvtojson'

// Admin Login
export const adminLogin = async (req, res) => {
  const { username, password } = req.body
  const errors = { usernameError: String, passwordError: String }
  try {
    const existingAdmin = await Admin.findOne({ username })
    if (!existingAdmin) {
      errors.usernameError = "Admin doesn't exist."
      return res.status(404).json(errors)
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingAdmin.password
    )
    if (!isPasswordCorrect) {
      errors.passwordError = 'Invalid Credentials'
      return res.status(404).json(errors)
    }

    const token = jwt.sign(
      {
        email: existingAdmin.email,
        id: existingAdmin._id,
      },
      'sEcReT'
    )

    res.status(200).json({ result: existingAdmin, token: token })
  } catch (error) {
    console.log(error)
  }
}

// update pass
export const updatedPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, email } = req.body
    const errors = { mismatchError: String }
    if (newPassword !== confirmPassword) {
      errors.mismatchError =
        'Your password and confirmation password do not match'
      return res.status(400).json(errors)
    }

    const admin = await Admin.findOne({ email })
    let hashedPassword
    hashedPassword = await bcrypt.hash(newPassword, 10)
    admin.password = hashedPassword
    await admin.save()
    if (admin.passwordUpdated === false) {
      admin.passwordUpdated = true
      await admin.save()
    }

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      response: admin,
    })
  } catch (error) {
    const errors = { backendError: String }
    errors.backendError = error
    res.status(500).json(errors)
  }
}

// update admin
export const updateAdmin = async (req, res) => {
  try {
    const { name, dob, department, contactNumber, avatar, email } = req.body
    const updatedAdmin = await Admin.findOne({ email })
    if (name) {
      updatedAdmin.name = name
      await updatedAdmin.save()
    }
    if (dob) {
      updatedAdmin.dob = dob
      await updatedAdmin.save()
    }
    if (department) {
      updatedAdmin.department = department
      await updatedAdmin.save()
    }
    if (contactNumber) {
      updatedAdmin.contactNumber = contactNumber
      await updatedAdmin.save()
    }
    if (avatar) {
      updatedAdmin.avatar = avatar
      await updatedAdmin.save()
    }
    res.status(200).json(updatedAdmin)
  } catch (error) {
    const errors = { backendError: String }
    errors.backendError = error
    res.status(500).json(errors)
  }
}

// new Admin
export const newAdmin = async (req, res) => {
  try {
    const { name, joiningYear, email, department, dob, contactNumber } =
      req.body
    const errors = { emailError: String }
    const existingAdmin = await Admin.findOne({ email })
    if (existingAdmin) {
      errors.emailError = 'Email already exists'
      return res.status(400).json(errors)
    }
    let hashedPassword
    const newDob = dob.split('-').reverse().join('-')
    var date = new Date()
    var components = ['ADM', date.getFullYear()]

    var username = components.join('')

    hashedPassword = await bcrypt.hash(newDob, 10)
    var passwordUpdated = false
    const newAdmin = await new Admin({
      name,
      email,
      password: hashedPassword,
      joiningYear,
      username,
      department,
      contactNumber,
      dob,
      passwordUpdated,
    })
    await newAdmin.save()
    return res.status(200).json({
      success: true,
      message: 'Admin registerd successfully',
      response: newAdmin,
    })
  } catch (error) {
    const errors = { backendError: String }
    errors.backendError = error
    res.status(500).json(errors)
  }
}

// add Admin
export const addAdmin = async (req, res) => {
  try {
    const { name, dob, department, contactNumber, avatar, email, joiningYear } =
      req.body
    const errors = { emailError: String }
    const existingAdmin = await Admin.findOne({ email })
    if (existingAdmin) {
      errors.emailError = 'Email already exists'
      return res.status(400).json(errors)
    }
    const existingDepartment = await Department.findOne({ department })
    let departmentHelper = existingDepartment.departmentCode
    const admins = await Admin.find({ department })

    let helper
    if (admins.length < 10) {
      helper = '00' + admins.length.toString()
    } else if (admins.length < 100 && admins.length > 9) {
      helper = '0' + admins.length.toString()
    } else {
      helper = admins.length.toString()
    }
    var date = new Date()
    var components = ['ADM', date.getFullYear(), departmentHelper, helper]

    var username = components.join('')
    let hashedPassword
    const newDob = dob.split('-').reverse().join('-')

    hashedPassword = await bcrypt.hash(newDob, 10)
    var passwordUpdated = false
    const newAdmin = await new Admin({
      name,
      email,
      password: hashedPassword,
      joiningYear,
      username,
      department,
      avatar,
      contactNumber,
      dob,
      passwordUpdated,
    })
    await newAdmin.save()
    return res.status(200).json({
      success: true,
      message: 'Admin registerd successfully',
      response: newAdmin,
    })
  } catch (error) {
    const errors = { backendError: String }
    errors.backendError = error
    res.status(500).json(errors)
  }
}

// create TimeTable
// create TimeTable
// create TimeTable
export const createTimeTable = async (req, res) => {
  try {
    const { department, year, section } = req.body
    const errors = { timeTableError: String }
    const existingTimeTable = await TimeTable.findOne({
      department,
      year,
      section,
    })
    const subjects = await Subject.find({ department, year })

    if (existingTimeTable) {
      errors.timeTableError = 'Time Table already created'
      return res.status(400).json(errors)
    }

    const timeSlot = ['9-10', '10-11', '11-12', '12-1', '1-2', '2-3', '3-4']
    const days = [0, 1, 2, 3, 4]

    // Get existing timetables for the same year and department (excluding the current section)
    const existingTimetables = await TimeTable.find({
      department,
      year,
      section: { $ne: section },
    })

    const newTimeTable = new TimeTable({
      year,
      department,
      section,
      entries: [],
    })

    for (let i = 0; i < days.length; i++) {
      const tempSubjects = [...subjects]

      const dayEntries = []

      for (let j = 0; j < timeSlot.length; j++) {
        if (tempSubjects.length === 0) {
          break
        }

        // Choose a random subject from tempSubjects
        const randomIndex = Math.floor(Math.random() * tempSubjects.length)
        const randomSubject = tempSubjects.splice(randomIndex, 1)[0]

        // Check if the subject is used in the same time slot for any existing timetable
        const isSubjectUsed = existingTimetables.some((timetable) =>
          timetable.entries.some(
            (dayEntry) =>
              dayEntry.day === days[i] &&
              dayEntry.entry.some(
                (entry) =>
                  entry.timeSlot === timeSlot[j] &&
                  entry.subject === randomSubject.subjectName
              )
          )
        )

        if (isSubjectUsed) {
          // If the subject is already used in the same time slot for another section, choose another subject
          j-- // Try again for the same time slot
        } else {
          // Create an entry for the day
          const entry = {
            timeSlot: timeSlot[j],
            subject: randomSubject.subjectName,
          }

          dayEntries.push(entry)
        }
      }

      // Add dayEntries to the new timetable
      newTimeTable.entries.push({ day: days[i], entry: dayEntries })
    }

    // Save the new timetable to the database
    await newTimeTable.save()

    res.status(200).json({
      success: true,
      message: 'Timetable created successfully',
      response: newTimeTable,
    })
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message })
  }
}

// delete TimeTable
export const deleteTimeTable = async (req, res) => {
  try {
    const { department, year } = req.body

    // Assuming department and year are properties in the timetable schema
    const timetable = await TimeTable.findOneAndDelete({ department, year })

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' })
    }

    res
      .status(200)
      .json({ success: true, message: 'Timetable deleted successfully' })
  } catch (error) {
    console.error('Error deleting timetable:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// get Time Table
export const getTimeTable = async (req, res) => {
  const { department, year, section } = req.query
  console.log(department, year)
  // console.log(department, year)
  try {
    const timetable = await TimeTable.findOne({ department, year, section })
    // console.log(timetable)

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' })
    }

    res.status(200).json({ result: timetable })
  } catch (error) {
    console.error('Error fetching timetable:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// get All Time Table
export const getAllTimeTable = async (req, res) => {
  try {
    const timeTables = await TimeTable.find()
    res.status(200).json(timeTables)
  } catch (error) {
    console.log('Backend Error', error)
  }
}
// create Notice
export const createNotice = async (req, res) => {
  try {
    const { from, content, topic, date, noticeFor } = req.body

    const errors = { noticeError: String }
    const exisitingNotice = await Notice.findOne({ topic, content, date })
    if (exisitingNotice) {
      errors.noticeError = 'Notice already created'
      return res.status(400).json(errors)
    }
    const newNotice = await new Notice({
      from,
      content,
      topic,
      noticeFor,
      date,
    })
    await newNotice.save()
    return res.status(200).json({
      success: true,
      message: 'Notice created successfully',
      response: newNotice,
    })
  } catch (error) {
    const errors = { backendError: String }
    errors.backendError = error
    res.status(500).json(errors)
  }
}

// add Department
export const addDepartment = async (req, res) => {
  try {
    const errors = { departmentError: String }
    const { department } = req.body
    const existingDepartment = await Department.findOne({ department })
    if (existingDepartment) {
      errors.departmentError = 'Department already added'
      return res.status(400).json(errors)
    }
    const departments = await Department.find({})
    let add = departments.length + 1
    let departmentCode
    if (add < 9) {
      departmentCode = '0' + add.toString()
    } else {
      departmentCode = add.toString()
    }

    const newDepartment = await new Department({
      department,
      departmentCode,
    })

    await newDepartment.save()
    return res.status(200).json({
      success: true,
      message: 'Department added successfully',
      response: newDepartment,
    })
  } catch (error) {
    const errors = { backendError: String }
    errors.backendError = error
    res.status(500).json(errors)
  }
}

// add Faculty
export const addFaculty = async (req, res) => {
  try {
    const {
      name,
      dob,
      department,
      contactNumber,
      avatar,
      email,
      joiningYear,
      gender,
      designation,
    } = req.body
    const errors = { emailError: String }
    const existingFaculty = await Faculty.findOne({ email })
    if (existingFaculty) {
      errors.emailError = 'Email already exists'
      return res.status(400).json(errors)
    }
    const existingDepartment = await Department.findOne({ department })
    let departmentHelper = existingDepartment.departmentCode

    const faculties = await Faculty.find({ department })
    let helper
    if (faculties.length < 10) {
      helper = '00' + faculties.length.toString()
    } else if (faculties.length < 100 && faculties.length > 9) {
      helper = '0' + faculties.length.toString()
    } else {
      helper = faculties.length.toString()
    }
    var date = new Date()
    var components = ['FAC', date.getFullYear(), departmentHelper, helper]

    var username = components.join('')
    let hashedPassword
    const newDob = dob.split('-').reverse().join('-')

    hashedPassword = await bcrypt.hash(newDob, 10)
    var passwordUpdated = false

    const newFaculty = await new Faculty({
      name,
      email,
      password: hashedPassword,
      joiningYear,
      username,
      department,
      avatar,
      contactNumber,
      dob,
      gender,
      designation,
      passwordUpdated,
    })
    await newFaculty.save()
    return res.status(200).json({
      success: true,
      message: 'Faculty registerd successfully',
      response: newFaculty,
    })
  } catch (error) {
    const errors = { backendError: String }
    errors.backendError = error
    res.status(500).json(errors)
  }
}

// get Faculty
export const getFaculty = async (req, res) => {
  try {
    const { department } = req.body
    const errors = { noFacultyError: String }
    const faculties = await Faculty.find({ department })
    if (faculties.length === 0) {
      errors.noFacultyError = 'No Faculty Found'
      return res.status(404).json(errors)
    }
    res.status(200).json({ result: faculties })
  } catch (error) {
    const errors = { backendError: String }
    errors.backendError = error
    res.status(500).json(errors)
  }
}

// get Notice
export const getNotice = async (req, res) => {
  try {
    const errors = { noNoticeError: String }
    const notices = await Notice.find({})
    if (notices.length === 0) {
      errors.noNoticeError = 'No Notice Found'
      return res.status(404).json(errors)
    }
    res.status(200).json({ result: notices })
  } catch (error) {
    const errors = { backendError: String }
    errors.backendError = error
    res.status(500).json(errors)
  }
}

// add Subject
export const addSubject = async (req, res) => {
  try {
    const { totalLectures, department, subjectCode, subjectName, year } =
      req.body
    const errors = { subjectError: String }
    const subject = await Subject.findOne({ subjectCode })
    if (subject) {
      errors.subjectError = 'Given Subject is already added'
      return res.status(400).json(errors)
    }

    const newSubject = await new Subject({
      totalLectures,
      department,
      subjectCode,
      subjectName,
      year,
    })

    await newSubject.save()
    const students = await Student.find({ department, year })
    if (students.length !== 0) {
      for (var i = 0; i < students.length; i++) {
        students[i].subjects.push(newSubject._id)
        await students[i].save()
      }
    }
    return res.status(200).json({
      success: true,
      message: 'Subject added successfully',
      response: newSubject,
    })
  } catch (error) {
    const errors = { backendError: String }
    errors.backendError = error
    res.status(500).json(errors)
  }
}

// get Subject
export const getSubject = async (req, res) => {
  try {
    const { department, year } = req.body

    // if (!req.userId) return res.json({ message: 'Unauthenticated' })
    const errors = { noSubjectError: String }

    const subjects = await Subject.find({ department, year })
    if (subjects.length === 0) {
      errors.noSubjectError = 'No Subject Found'
      return res.status(404).json(errors)
    }
    res.status(200).json({ result: subjects })
  } catch (error) {
    const errors = { backendError: String }
    errors.backendError = error
    res.status(500).json(errors)
  }
}

// get Admin
export const getAdmin = async (req, res) => {
  try {
    const { department } = req.body

    const errors = { noAdminError: String }

    const admins = await Admin.find({ department })
    if (admins.length === 0) {
      errors.noAdminError = 'No Subject Found'
      return res.status(404).json(errors)
    }
    res.status(200).json({ result: admins })
  } catch (error) {
    const errors = { backendError: String }
    errors.backendError = error
    res.status(500).json(errors)
  }
}

// delete Admin
export const deleteAdmin = async (req, res) => {
  try {
    const admins = req.body
    const errors = { noAdminError: String }
    for (var i = 0; i < admins.length; i++) {
      var admin = admins[i]

      await Admin.findOneAndDelete({ _id: admin })
    }
    res.status(200).json({ message: 'Admin Deleted' })
  } catch (error) {
    const errors = { backendError: String }
    errors.backendError = error
    res.status(500).json(errors)
  }
}

// delete Faculty
export const deleteFaculty = async (req, res) => {
  try {
    const faculties = req.body
    const errors = { noFacultyError: String }
    for (var i = 0; i < faculties.length; i++) {
      var faculty = faculties[i]

      await Faculty.findOneAndDelete({ _id: faculty })
    }
    res.status(200).json({ message: 'Faculty Deleted' })
  } catch (error) {
    const errors = { backendError: String }
    errors.backendError = error
    res.status(500).json(errors)
  }
}

// delete Student
export const deleteStudent = async (req, res) => {
  try {
    const students = req.body
    const errors = { noStudentError: String }
    for (var i = 0; i < students.length; i++) {
      var student = students[i]

      await Student.findOneAndDelete({ _id: student })
    }
    res.status(200).json({ message: 'Student Deleted' })
  } catch (error) {
    const errors = { backendError: String }
    errors.backendError = error
    res.status(500).json(errors)
  }
}

// delete Subject
export const deleteSubject = async (req, res) => {
  try {
    const subjects = req.body
    const errors = { noSubjectError: String }
    for (var i = 0; i < subjects.length; i++) {
      var subject = subjects[i]

      await Subject.findOneAndDelete({ _id: subject })
    }
    res.status(200).json({ message: 'Subject Deleted' })
  } catch (error) {
    const errors = { backendError: String }
    errors.backendError = error
    res.status(500).json(errors)
  }
}

// delete Department
export const deleteDepartment = async (req, res) => {
  try {
    const { department } = req.body

    await Department.findOneAndDelete({ department })

    res.status(200).json({ message: 'Department Deleted' })
  } catch (error) {
    const errors = { backendError: String }
    errors.backendError = error
    res.status(500).json(errors)
  }
}

// add Student
export const addStudent = async (req, res) => {
  try {
    const {
      name,
      dob,
      department,
      contactNumber,
      avatar,
      email,
      section,
      gender,
      batch,
      fatherName,
      motherName,
      fatherContactNumber,
      motherContactNumber,
      year,
    } = req.body
    const errors = { emailError: String }
    const existingStudent = await Student.findOne({ email })
    if (existingStudent) {
      errors.emailError = 'Email already exists'
      return res.status(400).json(errors)
    }
    const existingDepartment = await Department.findOne({ department })
    let departmentHelper = existingDepartment.departmentCode

    const students = await Student.find({ department })
    let helper
    if (students.length < 10) {
      helper = '00' + students.length.toString()
    } else if (students.length < 100 && students.length > 9) {
      helper = '0' + students.length.toString()
    } else {
      helper = students.length.toString()
    }
    var date = new Date()
    var components = ['STU', date.getFullYear(), departmentHelper, helper]

    var username = components.join('')
    let hashedPassword
    const newDob = dob

    hashedPassword = await bcrypt.hash(newDob, 10)
    var passwordUpdated = false

    const newStudent = await new Student({
      name,
      dob,
      password: hashedPassword,
      username,
      department,
      contactNumber,
      avatar,
      email,
      section,
      gender,
      batch,
      fatherName,
      motherName,
      fatherContactNumber,
      motherContactNumber,
      year,
      passwordUpdated,
    })
    await newStudent.save()
    const subjects = await Subject.find({ department, year })
    if (subjects.length !== 0) {
      for (var i = 0; i < subjects.length; i++) {
        newStudent.subjects.push(subjects[i]._id)
      }
    }
    await newStudent.save()
    return res.status(200).json({
      success: true,
      message: 'Student registerd successfully',
      response: newStudent,
    })
  } catch (error) {
    const errors = { backendError: String }
    errors.backendError = error
    res.status(500).json(errors)
  }
}

// get Student
export const getStudent = async (req, res) => {
  try {
    const { department, year, section } = req.body
    const errors = { noStudentError: String }
    const students = await Student.find({ department, year })

    if (students.length === 0) {
      errors.noStudentError = 'No Student Found'
      return res.status(404).json(errors)
    }

    res.status(200).json({ result: students })
  } catch (error) {
    const errors = { backendError: String }
    errors.backendError = error
    res.status(500).json(errors)
  }
}

// get All Students
export const getAllStudent = async (req, res) => {
  try {
    const students = await Student.find()
    res.status(200).json(students)
  } catch (error) {
    console.log('Backend Error', error)
  }
}

// get All Faculty
export const getAllFaculty = async (req, res) => {
  try {
    const faculties = await Faculty.find()
    res.status(200).json(faculties)
  } catch (error) {
    console.log('Backend Error', error)
  }
}

// get All Admin
export const getAllAdmin = async (req, res) => {
  try {
    const admins = await Admin.find()
    res.status(200).json(admins)
  } catch (error) {
    console.log('Backend Error', error)
  }
}

// get All Department
export const getAllDepartment = async (req, res) => {
  try {
    const departments = await Department.find()
    res.status(200).json(departments)
  } catch (error) {
    console.log('Backend Error', error)
  }
}

// get All Subject
export const getAllSubject = async (req, res) => {
  try {
    const subjects = await Subject.find()
    res.status(200).json(subjects)
  } catch (error) {
    console.log('Backend Error', error)
  }
}

// add All Students
export const addAllStudents = async (req, res) => {
  try {
    var userData = []
    const response = await csvtojson().fromFile(req.file.path)

    const errors = { emailError: String }
    var subjectData = []
    let newHelper
    for (var i = 0; i < response.length; i++) {
      const existingStudent = await Student.find({
        email: response[i].email,
      })
      if (existingStudent > 0) {
        errors.emailError = 'Email already exists'
        return res.status(400).json(errors)
      }
      let hashedPassword
      const newDob = response[i].dob.split('-').join('-')

      hashedPassword = await bcrypt.hash(newDob, 10)

      const existingDepartment = await Department.findOne({
        department: response[i].department,
      })
      let departmentHelper = existingDepartment.departmentCode

      if (i < 1) {
        const subjects = await Subject.find({
          department: response[i].department,
          year: response[i].year,
        })
        if (subjects.length !== 0) {
          for (var i = 0; i < subjects.length; i++) {
            subjectData.push(subjects[i]._id)
          }
        }

        const students = await Student.find({
          department: response[i].department,
        })

        newHelper = students.length
      }

      let helper
      if (newHelper < 10) {
        helper = '00' + newHelper.toString()
      } else if (newHelper < 100 && newHelper > 9) {
        helper = '0' + newHelper.toString()
      } else {
        helper = newHelper.toString()
      }
      var date = new Date()
      var components = ['STU', date.getFullYear(), departmentHelper, helper]

      var username = components.join('')

      userData.push({
        name: response[i].name,
        email: response[i].email,
        year: response[i].year,
        password: hashedPassword,
        username,
        gender: response[i].gender,
        fatherName: response[i].fatherName,
        motherName: response[i].motherName,
        department: response[i].department,
        batch: response[i].batch,
        section: response[i].section,
        contactNumber: response[i].contactNumber,
        fatherContactNumber: response[i].fatherContactNumber,
        dob: response[i].dob,
        subjects: subjectData,
      })
      newHelper++
    }

    await Student.insertMany(userData)

    res.send({ status: 200, success: true, msg: 'CSV imported' })
  } catch (error) {
    res.send({ status: 400, success: false, msg: error.message })
  }
}
