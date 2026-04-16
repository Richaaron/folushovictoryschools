import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IStudent extends Document {
  firstName: string
  lastName: string
  registrationNumber: string
  dateOfBirth: string
  gender: 'Male' | 'Female'
  level: 'Pre-Nursery' | 'Nursery' | 'Primary' | 'Secondary'
  class: string
  parentName: string
  parentPhone: string
  email: string
  enrollmentDate: string
  status: 'Active' | 'Inactive' | 'Suspended'
  image?: string
  parentUsername?: string
  parentPassword?: string
  compareParentPassword: (password: string) => Promise<boolean>
}

const StudentSchema = new Schema<IStudent>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  registrationNumber: { type: String, required: true, unique: true },
  dateOfBirth: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  level: { type: String, enum: ['Pre-Nursery', 'Nursery', 'Primary', 'Secondary'], required: true },
  class: { type: String, required: true },
  parentName: { type: String, required: true },
  parentPhone: { type: String, required: true },
  email: { type: String, required: true },
  enrollmentDate: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Inactive', 'Suspended'], default: 'Active' },
  image: { type: String },
  parentUsername: { type: String },
  parentPassword: { type: String },
})

StudentSchema.pre('save', async function (next) {
  if (!this.isModified('parentPassword') || !this.parentPassword) return next()
  const salt = await bcrypt.genSalt(10)
  this.parentPassword = await bcrypt.hash(this.parentPassword, salt)
  next()
})

StudentSchema.methods.compareParentPassword = async function (password: string) {
  if (!this.parentPassword) return false
  return bcrypt.compare(password, this.parentPassword)
}

export const Student = mongoose.model<IStudent>('Student', StudentSchema)
