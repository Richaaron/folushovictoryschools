import mongoose, { Schema, Document } from 'mongoose'

export interface IAttendance extends Document {
  studentId: mongoose.Types.ObjectId
  date: string
  status: 'Present' | 'Absent' | 'Late' | 'Excused'
  remarks?: string
  recordedBy: mongoose.Types.ObjectId
}

const AttendanceSchema = new Schema<IAttendance>({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Late', 'Excused'], required: true },
  remarks: { type: String },
  recordedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

// Index for faster queries on student and date
AttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true })

export const Attendance = mongoose.model<IAttendance>('Attendance', AttendanceSchema)
