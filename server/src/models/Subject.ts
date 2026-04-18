import mongoose, { Schema, Document } from 'mongoose'

export interface ISubject extends Document {
  name: string
  code: string
  level: 'Pre-Nursery' | 'Nursery' | 'Primary' | 'Secondary'
  creditUnits: number
  subjectCategory?: 'CORE' | 'ELECTIVE' | 'VOCATIONAL'
  description?: string
  curriculumType: 'NIGERIAN' | 'IGCSE' | 'OTHER'
  prerequisiteSubjects?: string[]
}

const SubjectSchema = new Schema<ISubject>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  level: { type: String, enum: ['Pre-Nursery', 'Nursery', 'Primary', 'Secondary'], required: true },
  creditUnits: { type: Number, default: 0 },
  subjectCategory: { type: String, enum: ['CORE', 'ELECTIVE', 'VOCATIONAL'], default: 'CORE' },
  description: { type: String },
  curriculumType: { type: String, enum: ['NIGERIAN', 'IGCSE', 'OTHER'], default: 'NIGERIAN' },
  prerequisiteSubjects: [{ type: String }],
})

export const Subject = mongoose.model<ISubject>('Subject', SubjectSchema)
