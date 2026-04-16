import mongoose, { Schema, Document } from 'mongoose'

export interface ISubjectResult extends Document {
  studentId: mongoose.Types.ObjectId
  subjectId: mongoose.Types.ObjectId
  term: string
  academicYear: string
  firstCA: number
  secondCA: number
  exam: number
  totalScore: number
  percentage: number
  grade: string
  gradePoint: number
  remarks: string
  dateRecorded: string
  recordedBy: mongoose.Types.ObjectId
}

const SubjectResultSchema = new Schema<ISubjectResult>({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  term: { type: String, required: true },
  academicYear: { type: String, required: true },
  firstCA: { type: Number, required: true },
  secondCA: { type: Number, required: true },
  exam: { type: Number, required: true },
  totalScore: { type: Number, required: true },
  percentage: { type: Number, required: true },
  grade: { type: String, required: true },
  gradePoint: { type: Number, required: true },
  remarks: { type: String, required: true },
  dateRecorded: { type: String, required: true },
  recordedBy: { type: Schema.Types.ObjectId, ref: 'Teacher' },
})

export const SubjectResult = mongoose.model<ISubjectResult>('SubjectResult', SubjectResultSchema)
