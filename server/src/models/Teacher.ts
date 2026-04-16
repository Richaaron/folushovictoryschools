import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface ITeacher extends Document {
  email: string
  name: string
  teacherId: string
  username: string
  password: string
  subject: string
  level: 'Pre-Nursery' | 'Nursery' | 'Primary' | 'Secondary'
  assignedClasses: string[]
  image?: string
  comparePassword: (password: string) => Promise<boolean>
}

const TeacherSchema = new Schema<ITeacher>({
  email: { type: String, required: true },
  name: { type: String, required: true },
  teacherId: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subject: { type: String, required: true },
  level: { type: String, enum: ['Pre-Nursery', 'Nursery', 'Primary', 'Secondary'], required: true },
  assignedClasses: [{ type: String }],
  image: { type: String },
})

TeacherSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

TeacherSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password)
}

export const Teacher = mongoose.model<ITeacher>('Teacher', TeacherSchema)
