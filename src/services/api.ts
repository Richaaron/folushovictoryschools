import { Student, Teacher, Subject, SubjectResult, Curriculum, SchemeOfWork } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

function getHeaders() {
  const session = localStorage.getItem('authSession')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  if (session) {
    try {
      const { token } = JSON.parse(session)
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    } catch (e) {
      console.error('Error parsing auth session for headers', e)
    }
  }
  
  return headers
}

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  })
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || `Request failed with status ${res.status}`)
  }
  
  return res.json()
}

// Students
export async function fetchStudents(): Promise<Student[]> {
  return apiFetch('/students')
}

export async function fetchStudent(id: string): Promise<Student> {
  return apiFetch(`/students/${id}`)
}

export async function createStudent(data: Partial<Student>): Promise<Student> {
  return apiFetch('/students', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateStudent(id: string, data: Partial<Student>): Promise<Student> {
  return apiFetch(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteStudent(id: string): Promise<void> {
  return apiFetch(`/students/${id}`, { 
    method: 'DELETE'
  })
}

// Teachers
export async function fetchTeachers(): Promise<Teacher[]> {
  return apiFetch('/teachers')
}

export async function fetchTeacher(id: string): Promise<Teacher> {
  return apiFetch(`/teachers/${id}`)
}

export async function createTeacher(data: Partial<Teacher>): Promise<Teacher> {
  return apiFetch('/teachers', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateTeacher(id: string, data: Partial<Teacher>): Promise<Teacher> {
  return apiFetch(`/teachers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteTeacher(id: string): Promise<void> {
  return apiFetch(`/teachers/${id}`, { 
    method: 'DELETE'
  })
}

// Subjects
export async function fetchSubjects(): Promise<Subject[]> {
  return apiFetch('/subjects')
}

export async function fetchSubject(id: string): Promise<Subject> {
  return apiFetch(`/subjects/${id}`)
}

export async function createSubject(data: Partial<Subject>): Promise<Subject> {
  return apiFetch('/subjects', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Results
export async function fetchResults(params: { studentId?: string, term?: string, academicYear?: string } = {}): Promise<SubjectResult[]> {
  const query = new URLSearchParams(params as any).toString()
  return apiFetch(`/results?${query}`)
}

export async function createResult(data: Partial<SubjectResult>): Promise<SubjectResult> {
  return apiFetch('/results', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateResult(id: string, data: Partial<SubjectResult>): Promise<SubjectResult> {
  return apiFetch(`/results/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteResult(id: string): Promise<void> {
  return apiFetch(`/results/${id}`, {
    method: 'DELETE'
  })
}

export async function saveBulkResults(data: { term: string, academicYear: string, results: any[] }): Promise<{ message: string }> {
  return apiFetch('/results/bulk', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Attendance
export async function fetchAttendance(params: { studentId?: string, date?: string, startDate?: string, endDate?: string } = {}): Promise<any[]> {
  const query = new URLSearchParams(params as any).toString()
  return apiFetch(`/attendance?${query}`)
}

export async function saveBulkAttendance(date: string, records: { studentId: string, status: string, remarks?: string }[]): Promise<void> {
  return apiFetch('/attendance/bulk', {
    method: 'POST',
    body: JSON.stringify({ date, records }),
  })
}

// Observations
export async function fetchObservations(params: { studentId?: string, term?: string, academicYear?: string } = {}): Promise<any[]> {
  const query = new URLSearchParams(params as any).toString()
  return apiFetch(`/observations?${query}`)
}

export async function saveObservation(data: any): Promise<any> {
  return apiFetch('/observations', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Config
export async function fetchConfig(): Promise<any> {
  return apiFetch('/config')
}

export async function updateConfig(data: any): Promise<any> {
  return apiFetch('/config', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// Curriculum
export async function fetchCurriculums(params: { level?: string, status?: string } = {}): Promise<Curriculum[]> {
  const query = new URLSearchParams(params as any).toString()
  return apiFetch(`/curriculum?${query}`)
}

export async function fetchCurriculum(id: string): Promise<Curriculum> {
  return apiFetch(`/curriculum/${id}`)
}

export async function createCurriculum(data: Partial<Curriculum>): Promise<Curriculum> {
  return apiFetch('/curriculum', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateCurriculum(id: string, data: Partial<Curriculum>): Promise<Curriculum> {
  return apiFetch(`/curriculum/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteCurriculum(id: string): Promise<void> {
  return apiFetch(`/curriculum/${id}`, {
    method: 'DELETE'
  })
}

export async function fetchCurriculumsByLevel(level: string): Promise<Curriculum[]> {
  return apiFetch(`/curriculum/level/${level}`)
}

// Scheme of Work
export async function fetchSchemesOfWork(teacherId: string): Promise<SchemeOfWork[]> {
  return apiFetch(`/scheme-of-work/teacher/${teacherId}`)
}

export async function fetchSchemeOfWork(id: string): Promise<SchemeOfWork> {
  return apiFetch(`/scheme-of-work/${id}`)
}

export async function createSchemeOfWork(data: Partial<SchemeOfWork>): Promise<SchemeOfWork> {
  return apiFetch('/scheme-of-work', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateSchemeOfWork(id: string, data: Partial<SchemeOfWork>): Promise<SchemeOfWork> {
  return apiFetch(`/scheme-of-work/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function submitSchemeOfWork(id: string): Promise<{ message: string, scheme: SchemeOfWork }> {
  return apiFetch(`/scheme-of-work/${id}/submit`, {
    method: 'PUT',
  })
}

export async function approveSchemeOfWork(id: string): Promise<{ message: string, scheme: SchemeOfWork }> {
  return apiFetch(`/scheme-of-work/${id}/approve`, {
    method: 'PUT',
  })
}

export async function updateTopicStatus(schemeId: string, weekNumber: number, status: string): Promise<SchemeOfWork> {
  return apiFetch(`/scheme-of-work/${schemeId}/topic/${weekNumber}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  })
}

export async function deleteSchemeOfWork(id: string): Promise<void> {
  return apiFetch(`/scheme-of-work/${id}`, {
    method: 'DELETE'
  })
}

