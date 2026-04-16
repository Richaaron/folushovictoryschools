import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { connectDB } from './config/db'
import { User } from './models/User'
import { Teacher } from './models/Teacher'
import { Subject } from './models/Subject'

dotenv.config()

const DEFAULT_SUBJECTS = [
  { name: 'Mathematics', code: 'MTH', level: 'Primary', creditUnits: 3 },
  { name: 'English Language', code: 'ENG', level: 'Primary', creditUnits: 3 },
  { name: 'Basic Science', code: 'BSC', level: 'Primary', creditUnits: 2 },
]

const DEFAULT_ADMIN = {
  email: 'admin@folusho.com',
  name: 'Admin User',
  password: 'admin123',
  role: 'Admin',
}

async function seed() {
  await connectDB()
  console.log('Connected to MongoDB')

  await User.deleteMany({})
  await Teacher.deleteMany({})
  await Subject.deleteMany({})

  await User.create(DEFAULT_ADMIN)
  console.log('Created default admin')

  const subjects = await Subject.insertMany(DEFAULT_SUBJECTS)
  console.log('Created default subjects')

  await Teacher.create({
    email: 'teacher@folusho.com',
    name: 'Mr. Adeyemi',
    teacherId: 'T001',
    username: 'teacher',
    password: 'teacher123',
    subject: 'Mathematics',
    level: 'Secondary',
    assignedClasses: ['SSS1A', 'SSS1B', 'SSS2A'],
  })
  console.log('Created default teacher')

  console.log('Seed completed!')
  process.exit(0)
}

seed().catch(console.error)