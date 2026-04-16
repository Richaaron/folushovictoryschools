import mongoose, { Schema, Document } from 'mongoose'

export interface ISchoolConfig extends Document {
  currentTerm: '1st Term' | '2nd Term' | '3rd Term'
  currentAcademicYear: string
  availableClasses: string[]
  schoolName: string
  schoolLogo?: string // Base64
  themeColor: string
}

const SchoolConfigSchema = new Schema<ISchoolConfig>({
  currentTerm: { type: String, enum: ['1st Term', '2nd Term', '3rd Term'], default: '1st Term' },
  currentAcademicYear: { type: String, default: '2023/2024' },
  availableClasses: [{ type: String }],
  schoolName: { type: String, default: 'Folusho Victory Schools' },
  schoolLogo: { type: String },
  themeColor: { type: String, default: '#2563eb' }, // Default blue-600
})

export const SchoolConfig = mongoose.model<ISchoolConfig>('SchoolConfig', SchoolConfigSchema)
