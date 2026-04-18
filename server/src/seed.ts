import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { connectDB } from './config/db'
import { User } from './models/User'
import { Teacher } from './models/Teacher'
import { Subject } from './models/Subject'
import { Curriculum } from './models/Curriculum'

dotenv.config()

// Comprehensive Nigerian School Curriculum Subjects
const NIGERIAN_SUBJECTS = [
  // PRE-NURSERY SUBJECTS
  { name: 'Numeracy', code: 'NUM-PN', level: 'Pre-Nursery', creditUnits: 2, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Basic number recognition and counting' },
  { name: 'Early Literacy', code: 'LIT-PN', level: 'Pre-Nursery', creditUnits: 2, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Introduction to letters and phonics' },
  { name: 'Personal Development', code: 'PD-PN', level: 'Pre-Nursery', creditUnits: 2, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Social and emotional development' },
  { name: 'Creative Arts', code: 'ART-PN', level: 'Pre-Nursery', creditUnits: 1, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Drawing, painting and crafts' },
  { name: 'Physical Development', code: 'PHY-PN', level: 'Pre-Nursery', creditUnits: 2, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Motor skills and physical activities' },

  // NURSERY SUBJECTS
  { name: 'Numeracy', code: 'NUM-NS', level: 'Nursery', creditUnits: 2, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Number operations and basic arithmetic' },
  { name: 'Literacy', code: 'LIT-NS', level: 'Nursery', creditUnits: 3, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Reading, writing and comprehension' },
  { name: 'Phonics', code: 'PHO-NS', level: 'Nursery', creditUnits: 2, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Sound recognition and blending' },
  { name: 'Environmental Studies', code: 'ENV-NS', level: 'Nursery', creditUnits: 2, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Introduction to nature and environment' },
  { name: 'Creative Arts', code: 'ART-NS', level: 'Nursery', creditUnits: 1, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Art, music and creative expression' },
  { name: 'Physical Education', code: 'PE-NS', level: 'Nursery', creditUnits: 1, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Sports and physical activities' },
  { name: 'Social Studies', code: 'SS-NS', level: 'Nursery', creditUnits: 1, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Community and family awareness' },

  // PRIMARY SCHOOL SUBJECTS (Classes 1-6)
  { name: 'English Language', code: 'ENG-PR', level: 'Primary', creditUnits: 4, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Comprehensive English language skills' },
  { name: 'Mathematics', code: 'MTH-PR', level: 'Primary', creditUnits: 4, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Numeracy and mathematical concepts' },
  { name: 'Basic Science', code: 'BSC-PR', level: 'Primary', creditUnits: 3, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Introduction to science concepts' },
  { name: 'Social Studies', code: 'SS-PR', level: 'Primary', creditUnits: 3, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Civic education and social sciences' },
  { name: 'Creative Arts', code: 'ART-PR', level: 'Primary', creditUnits: 2, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Visual arts and music' },
  { name: 'Physical Education', code: 'PE-PR', level: 'Primary', creditUnits: 2, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Sports and health education' },
  { name: 'Computer Studies', code: 'CST-PR', level: 'Primary', creditUnits: 2, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'ICT basics and computer literacy' },
  { name: 'Islamic Religion Studies', code: 'IRS-PR', level: 'Primary', creditUnits: 2, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Islamic education and ethics' },
  { name: 'Christian Religion Studies', code: 'CRS-PR', level: 'Primary', creditUnits: 2, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Christian education and ethics' },
  { name: 'Yoruba Language', code: 'YOR-PR', level: 'Primary', creditUnits: 2, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Yoruba language and culture' },
  { name: 'Igbo Language', code: 'IGB-PR', level: 'Primary', creditUnits: 2, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Igbo language and culture' },
  { name: 'Hausa Language', code: 'HSA-PR', level: 'Primary', creditUnits: 2, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Hausa language and culture' },

  // SECONDARY SCHOOL SUBJECTS (JSS 1-3 and SSS 1-3)
  // Core Subjects
  { name: 'English Language', code: 'ENG-SEC', level: 'Secondary', creditUnits: 5, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Advanced English language and literature' },
  { name: 'Mathematics', code: 'MTH-SEC', level: 'Secondary', creditUnits: 5, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Advanced mathematics' },
  { name: 'Integrated Science', code: 'ISC-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Biology, Chemistry, Physics (JSS)' },
  { name: 'Social Studies', code: 'SS-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Civic education, history, geography' },

  // Science Subjects (SSS)
  { name: 'Physics', code: 'PHY-SEC', level: 'Secondary', creditUnits: 5, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'WAEC/NECO Physics curriculum' },
  { name: 'Chemistry', code: 'CHM-SEC', level: 'Secondary', creditUnits: 5, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'WAEC/NECO Chemistry curriculum' },
  { name: 'Biology', code: 'BIO-SEC', level: 'Secondary', creditUnits: 5, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'WAEC/NECO Biology curriculum' },
  { name: 'Further Mathematics', code: 'FMT-SEC', level: 'Secondary', creditUnits: 5, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Advanced mathematics (SSS 2-3)' },

  // Arts/Humanities Subjects
  { name: 'Literature in English', code: 'LEN-SEC', level: 'Secondary', creditUnits: 4, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'WAEC/NECO Literature curriculum' },
  { name: 'History', code: 'HIS-SEC', level: 'Secondary', creditUnits: 4, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'World and African history' },
  { name: 'Geography', code: 'GEO-SEC', level: 'Secondary', creditUnits: 4, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Physical and human geography' },
  { name: 'Government', code: 'GOV-SEC', level: 'Secondary', creditUnits: 4, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Political science and government' },
  { name: 'Economics', code: 'ECO-SEC', level: 'Secondary', creditUnits: 4, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Economics principles and applications' },

  // Vocational/Technical Subjects
  { name: 'Computer Science', code: 'CSC-SEC', level: 'Secondary', creditUnits: 4, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'WAEC/NECO Computer Science' },
  { name: 'Information Technology', code: 'IT-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'VOCATIONAL', curriculumType: 'NIGERIAN', description: 'Practical ICT skills' },
  { name: 'Business Studies', code: 'BUS-SEC', level: 'Secondary', creditUnits: 4, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Commerce and business concepts' },
  { name: 'Accounting', code: 'ACC-SEC', level: 'Secondary', creditUnits: 4, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Bookkeeping and accounting principles' },
  { name: 'Technical Drawing', code: 'TD-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'VOCATIONAL', curriculumType: 'NIGERIAN', description: 'Engineering and technical drawing' },

  // Language Subjects
  { name: 'French', code: 'FRN-SEC', level: 'Secondary', creditUnits: 4, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'WAEC/NECO French' },
  { name: 'Yoruba', code: 'YOR-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Yoruba language and culture' },
  { name: 'Igbo', code: 'IGB-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Igbo language and culture' },
  { name: 'Hausa', code: 'HSA-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Hausa language and culture' },
  { name: 'Arabic', code: 'ARB-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Arabic language and culture' },

  // Special Subjects
  { name: 'Physical Education', code: 'PE-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Sports science and health education' },
  { name: 'Health Education', code: 'HED-SEC', level: 'Secondary', creditUnits: 2, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Health and wellness education' },
  { name: 'Islamic Religion Studies', code: 'IRS-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Islamic education (WAEC/NECO)' },
  { name: 'Christian Religion Studies', code: 'CRS-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Christian education (WAEC/NECO)' },
  { name: 'Fine Arts', code: 'FA-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Visual arts and design' },
  { name: 'Music', code: 'MUS-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Music theory and practice' },
]

const DEFAULT_ADMIN = {
  email: 'admin@folusho.com',
  name: 'Admin User',
  password: 'AdminPassword123!@#',
  role: 'Admin',
}

async function seed() {
  await connectDB()
  console.log('Connected to MongoDB')

  await User.deleteMany({})
  await Teacher.deleteMany({})
  await Subject.deleteMany({})
  await Curriculum.deleteMany({})

  await User.create(DEFAULT_ADMIN)
  console.log('✅ Created default admin')

  const subjects = await Subject.insertMany(NIGERIAN_SUBJECTS)
  console.log(`✅ Created ${subjects.length} Nigerian curriculum subjects`)

  // Create default curriculum
  const primarySubjects = subjects.filter(s => s.level === 'Primary').map(s => s._id.toString())
  const secondarySubjects = subjects.filter(s => s.level === 'Secondary').map(s => s._id.toString())

  await Curriculum.create([
    {
      name: 'Nigerian Primary School Curriculum',
      version: '2023.1',
      level: 'Primary',
      yearsOfStudy: 6,
      subjects: primarySubjects,
      implementationDate: new Date('2023-09-01'),
      description: 'Current Nigerian primary school curriculum (Classes 1-6)',
      curriculum: 'NIGERIAN',
      status: 'ACTIVE',
      createdBy: 'admin@folusho.com',
    },
    {
      name: 'Nigerian Secondary School Curriculum',
      version: '2023.1',
      level: 'Secondary',
      yearsOfStudy: 6,
      subjects: secondarySubjects,
      implementationDate: new Date('2023-09-01'),
      description: 'Current Nigerian secondary school curriculum (JSS 1-3, SSS 1-3)',
      curriculum: 'NIGERIAN',
      status: 'ACTIVE',
      createdBy: 'admin@folusho.com',
    },
  ])
  console.log('✅ Created default curriculum catalogs')

  await Teacher.create({
    email: 'teacher1@folusho.com',
    name: 'Mr. Adeyemi',
    teacherId: 'T001',
    username: 'teacher1',
    password: 'TeacherPassword123!@#',
    subject: 'Mathematics',
    level: 'Secondary',
    assignedClasses: ['SSS1A', 'SSS1B', 'SSS2A'],
  })
  console.log('✅ Created default teacher')

  console.log('\n🎓 Seed completed successfully!')
  console.log(`Total Subjects: ${subjects.length}`)
  console.log('Available Levels: Pre-Nursery, Nursery, Primary, Secondary')
  process.exit(0)
}

seed().catch(console.error)