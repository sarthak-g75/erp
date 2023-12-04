import mongoose from 'mongoose'

const { Schema } = mongoose

const timeTableSchema = new Schema({
  year: Number,
  department: String,
  section: Number,
  entries: [
    {
      day: Number,
      entry: [{ timeSlot: String, subject: String }],
    },
  ],
})

export default mongoose.model('Timetable', timeTableSchema)
