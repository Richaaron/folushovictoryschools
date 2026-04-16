import mongoose, { Schema, Document } from 'mongoose'

export interface ISubject extends Document {
  name: string
  code: string
  level: 'Pre-Nursery' | 'Nursery' | 'Primary' | 'Secondary'
  creditUnits: number
}

const SubjectSchema = new Schema<ISubject>({
  name: { type: String, required: true },
  code: { type: String, required: true },
  level: { type: String, enum: ['Pre-Nursery', 'Nursery', 'Primary', 'Secondary'], required: true },
  creditUnits: { type: Number, default: 0 },
})

export const Subject = mongoose.model<ISubject>('Subject', SubjectSchema)
