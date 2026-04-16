# Folusho Result Computing Software - Development Instructions

This is a professional result management system for Folusho Victory Schools built with React, Vite, and Tailwind CSS.

## Project Overview

The application manages student records, test/exam results, grade calculations, and comprehensive reporting for three school levels: Nursery, Primary, and Secondary.

## Tech Stack

- **Frontend**: React 18.2 with TypeScript
- **Build**: Vite 5.0
- **Styling**: Tailwind CSS 3.3
- **Routing**: React Router DOM
- **UI Icons**: Lucide React
- **Storage**: Browser LocalStorage

## Key Features

1. **Dashboard** - Real-time performance overview
2. **Student Management** - CRUD operations for student records
3. **Result Entry** - Recording test and exam scores with automatic grading
4. **Reports & Analytics** - Comprehensive performance reports by student, class, and subject

## Architecture

### Components
- `StatCard` - Statistics display component
- `Table` - Reusable data table
- `StudentForm` - Student data entry modal
- `ResultForm` - Result recording modal with preview

### Pages
- `Dashboard` - Overview and quick stats
- `StudentManagement` - Student CRUD and management
- `ResultEntry` - Result recording interface
- `Reports` - Analytics and reporting

### Utilities
- `calculations.ts` - Grade, GPA, and percentage calculations
- `useLocalStorage.ts` - Custom hook for persistent data storage

### Types
- `Student`, `Result`, `Subject` - Core data models
- `GradeScale` - Grade configuration

## Development Workflow

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Build: `npm run build`
4. Preview: `npm run preview`

## Code Style Guidelines

- Use TypeScript for type safety
- Component names in PascalCase
- File names match component names
- Functional components with hooks
- Tailwind for styling (no CSS modules)
- Consistent naming: `handleEvent` for handlers

## Data Model

```typescript
Student {
  id, firstName, lastName, registrationNumber,
  dateOfBirth, gender, level, class, parentName,
  parentPhone, email, enrollmentDate, status
}

Result {
  id, studentId, subjectId, assessmentType,
  score, totalScore, dateRecorded, term,
  academicYear, recordedBy, notes
}

Subject {
  id, name, code, level, creditUnits
}
```

## Grade Scale

- A (90-100): 4.0 points - Excellent
- B (80-89): 3.0 points - Good
- C (70-79): 2.0 points - Average
- D (60-69): 1.0 points - Below Average
- F (0-59): 0.0 points - Fail

## Important Notes

- Data persists in browser LocalStorage only
- No backend required for current implementation
- CSV export available for data backup
- Responsive design supports mobile to desktop
- All forms include validation
- GPA and grades calculated automatically

## File Structure

```
src/
├── components/       # Reusable React components
├── pages/           # Page components (routed)
├── hooks/           # Custom React hooks
├── types/           # TypeScript definitions
├── utils/           # Utility functions
├── App.tsx          # Main app component
├── App.css          # App-specific styles
├── index.css        # Global styles
└── main.tsx         # Entry point
```

## Component Patterns

All forms follow this pattern:
1. Local state for form data
2. Validation before submit
3. Error message display
4. Modal presentation
5. Cancel and submit handlers

All pages use:
1. `useLocalStorage` hook for data
2. Search/filter functionality
3. Table display with actions
4. Export to CSV capability

## Adding New Features

1. Create new component in `src/components/`
2. Add types in `src/types/index.ts`
3. Create page in `src/pages/` if needed
4. Add route in `App.tsx`
5. Add navigation link in `App.tsx` sidebar
6. Use `useLocalStorage` for persistence

## Testing Considerations

- Test form validation
- Verify calculations (grades, GPA, percentages)
- Check data persistence in LocalStorage
- Test export functionality
- Validate responsive design
- Test search and filter features

## Deployment

For production deployment:
1. Run `npm run build`
2. Deploy `dist` folder to static host
3. Consider backend integration for data persistence
4. Implement user authentication
5. Add database storage

---

For questions about the codebase, refer to README.md for comprehensive documentation.
