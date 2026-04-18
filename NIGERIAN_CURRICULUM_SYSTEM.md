# Nigerian School Curriculum Management System

## Overview
The Folusho Reporting Sheet has been enhanced with a comprehensive **Nigerian School Curriculum Management System** that provides teachers with curriculum catalogs and scheme of work management capabilities. The system follows the current Nigerian school curriculum standards for all educational levels.

## System Components

### 1. **Database Models**

#### Curriculum Model (`server/src/models/Curriculum.ts`)
Stores curriculum information and metadata:
- **Name**: Official curriculum name (e.g., "Nigerian Primary School Curriculum")
- **Version**: Version number (e.g., "2023.1")
- **Level**: Educational level (Pre-Nursery, Nursery, Primary, Secondary)
- **Years of Study**: Duration of the curriculum
- **Subjects**: Array of subject IDs included in the curriculum
- **Implementation Date**: When curriculum was implemented
- **Revision Date**: Optional date of last revision
- **Curriculum Type**: NIGERIAN, IGCSE, or OTHER
- **Status**: ACTIVE, ARCHIVED, or DRAFT
- **Created By**: Admin who created the curriculum

#### SchemeOfWork Model (`server/src/models/SchemeOfWork.ts`)
Manages teacher-specific curriculum implementation plans:
- **Teacher ID**: Email of the teacher
- **Subject ID**: Subject being taught
- **Class ID**: Class identifier (e.g., "SSS1A")
- **Academic Year**: Year of the scheme
- **Term**: Semester number (1, 2, 3)
- **Curriculum ID**: Reference to the curriculum being followed
- **Topics**: Array of weekly topics with:
  - Week number
  - Topic name
  - Duration (in weeks)
  - Learning objectives
  - Resources needed
  - Assessment method
  - Status (PLANNED, IN_PROGRESS, COMPLETED)
- **Status**: DRAFT, SUBMITTED, APPROVED, or ACTIVE
- **Version**: Scheme version number for tracking updates

### 2. **Nigerian School Curriculum Subjects**

The system includes **53 subjects** across all educational levels:

#### **Pre-Nursery (5 subjects)**
- Numeracy
- Early Literacy
- Personal Development
- Creative Arts
- Physical Development

#### **Nursery (7 subjects)**
- Numeracy
- Literacy
- Phonics
- Environmental Studies
- Creative Arts
- Physical Education
- Social Studies

#### **Primary School (12 subjects)**
- Core: English Language, Mathematics, Basic Science, Social Studies, Physical Education, Computer Studies
- Religion: Islamic Religion Studies, Christian Religion Studies
- Languages: Yoruba, Igbo, Hausa
- Elective: Creative Arts

#### **Secondary School (29 subjects)**

**Core Subjects:**
- English Language
- Mathematics
- Integrated Science (JSS)
- Physics, Chemistry, Biology (SSS)
- Social Studies
- Physical Education
- Health Education

**WAEC/NECO Subjects:**
- Literature in English
- Further Mathematics
- History
- Geography
- Government
- Economics
- Computer Science
- Business Studies
- Accounting
- Technical Drawing

**Language Subjects:**
- French
- Yoruba
- Igbo
- Hausa
- Arabic

**Religion & Arts:**
- Islamic Religion Studies
- Christian Religion Studies
- Fine Arts
- Music

### 3. **API Endpoints**

#### Curriculum Management
```
GET    /api/curriculum              - Get all curriculums
GET    /api/curriculum/:id          - Get specific curriculum
POST   /api/curriculum              - Create new curriculum (Admin only)
PUT    /api/curriculum/:id          - Update curriculum (Admin only)
DELETE /api/curriculum/:id          - Delete curriculum (Admin only)
GET    /api/curriculum/level/:level - Get curriculums by level
```

#### Scheme of Work Management
```
GET    /api/scheme-of-work/teacher/:teacherId        - Get teacher's schemes
GET    /api/scheme-of-work/:id                       - Get specific scheme
POST   /api/scheme-of-work                           - Create new scheme (Teacher/Admin)
PUT    /api/scheme-of-work/:id                       - Update scheme
PUT    /api/scheme-of-work/:id/submit               - Submit for approval (Teacher)
PUT    /api/scheme-of-work/:id/approve              - Approve scheme (Admin)
PUT    /api/scheme-of-work/:id/topic/:weekNumber    - Update topic status
DELETE /api/scheme-of-work/:id                      - Delete scheme
```

### 4. **Frontend Components**

#### CurriculumManager Component (`src/components/CurriculumManager.tsx`)
**Features:**
- Display all curriculums for a specific school level
- Show curriculum metadata (version, duration, subjects count)
- Filter by status (ACTIVE, DRAFT, ARCHIVED)
- View curriculum details in modal
- Add, edit, delete curriculums
- Responsive grid layout

**Props:**
- `level`: School level (Pre-Nursery, Nursery, Primary, Secondary)

#### SchemeOfWorkManager Component (`src/components/SchemeOfWorkManager.tsx`)
**Features:**
- View all teacher's schemes of work
- Create new schemes with topics
- Add weekly topics with objectives, resources, and assessments
- Track progress with visual progress bar
- Submit schemes for approval
- Update topic completion status
- Manage scheme statuses (DRAFT → SUBMITTED → APPROVED → ACTIVE)
- Delete schemes (only DRAFT schemes)

**Props:**
- `teacherId`: Teacher's email
- `level`: School level

#### Enhanced TeacherDashboard (`src/pages/TeacherDashboard.tsx`)
**Features:**
- Tabbed interface with three sections:
  1. **Class Results** - Student grades and performance
  2. **Curriculum** - Curriculum catalogs for current level
  3. **Scheme of Work** - Teacher's lesson planning tools

**Layout:**
- Responsive tabs for mobile and desktop
- Quick statistics cards
- Smooth tab transitions with Framer Motion

### 5. **Subject Categories**

Each subject is classified:
- **CORE**: Required subjects for all students
- **ELECTIVE**: Optional subjects students can choose
- **VOCATIONAL**: Technical/vocational subjects for practical skills

### 6. **Curriculum Types**

- **NIGERIAN**: Following Nigerian National Curriculum Council (NCC) standards
- **IGCSE**: International General Certificate of Secondary Education (future support)
- **OTHER**: Custom curriculum types (future support)

## User Workflows

### For Teachers

1. **View Curriculum**
   - Navigate to "Curriculum" tab
   - See available curriculums for your school level
   - View subject list and duration
   - Get curriculum details and implementation dates

2. **Create Scheme of Work**
   - Click "New Scheme" button
   - Select subject, class, academic year, term
   - Add topics with weekly breakdown
   - Define objectives, resources, and assessments
   - Save as DRAFT

3. **Manage Scheme Progress**
   - Update topic status as lessons progress
   - Track completion percentage
   - Submit scheme for admin approval
   - Make revisions to DRAFT schemes

4. **Implement Approved Schemes**
   - Once approved, scheme becomes ACTIVE
   - Use as teaching guide throughout term
   - Track which topics have been taught

### For Administrators

1. **Create Curriculum**
   - Define new curriculum versions
   - Assign subjects to curriculum
   - Set implementation dates
   - Mark as DRAFT, then ACTIVE when ready

2. **Review Schemes**
   - View submitted schemes from all teachers
   - Approve schemes for implementation
   - Provide feedback and request revisions
   - Archive old schemes when curriculum updates

3. **Manage Curriculum Updates**
   - Create new curriculum versions when changes occur
   - Update subject lists
   - Archive outdated curriculums
   - Maintain audit trail of changes

## Database Seeding

The system comes pre-seeded with:
- ✅ **53 Nigerian curriculum subjects** (across all levels)
- ✅ **2 curriculum catalogs** (Primary and Secondary)
- ✅ **Default admin account** (admin@folusho.com)
- ✅ **Sample teacher** (teacher1@folusho.com)

### Subjects by Level
- Pre-Nursery: 5 subjects
- Nursery: 7 subjects
- Primary: 12 subjects
- Secondary: 29 subjects
- **Total: 53 subjects**

## Features & Capabilities

### ✅ Implemented
- [x] Comprehensive Nigerian curriculum database (53 subjects)
- [x] Curriculum catalog management
- [x] Teacher scheme of work creation and tracking
- [x] Weekly topic planning with objectives and resources
- [x] Scheme approval workflow (DRAFT → SUBMITTED → APPROVED → ACTIVE)
- [x] Progress tracking with visual indicators
- [x] Responsive mobile and desktop UI
- [x] Role-based access control (Teacher, Admin)
- [x] REST API for all operations
- [x] TypeScript type safety

### 🔜 Future Enhancements
- [ ] Scheme of work document export (PDF/Word)
- [ ] Upload scheme of work templates
- [ ] Curriculum version history tracking
- [ ] Subject prerequisite mapping
- [ ] Multi-language curriculum support
- [ ] Curriculum comparison tools
- [ ] Scheme of work collaboration features
- [ ] Performance analytics by curriculum

## Technical Stack

**Backend:**
- Express.js with TypeScript
- MongoDB for data persistence
- JWT authentication
- REST API architecture

**Frontend:**
- React 18.2 with TypeScript
- Framer Motion for animations
- Tailwind CSS for styling
- React Router for navigation

**Models:**
- Curriculum Model (with versioning)
- SchemeOfWork Model (with status workflow)
- Subject Model (enhanced with categories and types)

## File Structure

```
server/src/
├── models/
│   ├── Curriculum.ts          [NEW]
│   ├── SchemeOfWork.ts        [NEW]
│   └── Subject.ts             [UPDATED]
├── routes/
│   ├── curriculum.ts          [NEW]
│   ├── schemeOfWork.ts        [NEW]
│   └── index.ts               [UPDATED - routes registered]
└── seed.ts                    [UPDATED - 53 subjects]

src/
├── components/
│   ├── CurriculumManager.tsx      [NEW]
│   └── SchemeOfWorkManager.tsx    [NEW]
├── pages/
│   └── TeacherDashboard.tsx       [UPDATED - tabbed interface]
├── services/
│   └── api.ts                 [UPDATED - new API functions]
└── types/
    └── index.ts               [UPDATED - new types]
```

## Access & Testing

**Login Credentials:**
- **Admin**: admin@folusho.com / AdminPassword123!@#
- **Teacher**: teacher1@folusho.com / TeacherPassword123!@#

**URLs:**
- Application: http://localhost:5176
- Backend API: http://localhost:3001/api

## Completion Status

✅ **Nigerian School Curriculum**: All subjects following NCC standards
✅ **Curriculum Catalog**: Database and UI for curriculum management
✅ **Scheme of Work**: Teachers can create and manage lesson plans
✅ **Update System**: New curriculums can be added dynamically without code changes
✅ **Responsive Design**: Mobile and desktop compatible
✅ **Teacher Dashboard**: Integrated curriculum and scheme management

---

**Created**: April 18, 2026
**System**: Folusho Reporting Sheet v2.0
**Curriculum Data**: Nigerian National Curriculum Council (NCC) Standards
