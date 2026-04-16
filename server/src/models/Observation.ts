import mongoose, { Schema, Document } from 'mongoose'

export interface IObservation extends Document {
  studentId: mongoose.Types.ObjectId
  term: string
  academicYear: string
  affectiveDomain: {
    punctuality: number
    neatness: number
    honesty: number
    leadership: number
    cooperation: number
    selfControl: number
  }
  psychomotorSkills: {
    handwriting: number
    sports: number
    arts: number
    fluency: number
  }
  teacherComment: string
  principalComment: string
  recordedBy: mongoose.Types.ObjectId
}

const ObservationSchema = new Schema<IObservation>({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  term: { type: String, required: true },
  academicYear: { type: String, required: true },
  affectiveDomain: {
    punctuality: { type: Number, min: 1, max: 5, default: 3 },
    neatness: { type: Number, min: 1, max: 5, default: 3 },
    honesty: { type: Number, min: 1, max: 5, default: 3 },
    leadership: { type: Number, min: 1, max: 5, default: 3 },
    cooperation: { type: Number, min: 1, max: 5, default: 3 },
    selfControl: { type: Number, min: 1, max: 5, default: 3 },
  },
  psychomotorSkills: {
    handwriting: { type: Number, min: 1, max: 5, default: 3 },
    sports: { type: Number, min: 1, max: 5, default: 3 },
    arts: { type: Number, min: 1, max: 5, default: 3 },
    fluency: { type: Number, min: 1, max: 5, default: 3 },
  },
  teacherComment: { type: String },
  principalComment: { type: String },
  recordedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

// Ensure one observation per student per term
ObservationSchema.index({ studentId: 1, term: 1, academicYear: 1 }, { unique: true })

export const Observation = mongoose.model<IObservation>('Observation', ObservationSchema)
