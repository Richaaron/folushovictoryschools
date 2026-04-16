import { useState, useEffect, useMemo } from 'react'
import { Plus, Trash2, Download, Search } from 'lucide-react'
import { Result, Student, Subject } from '../types'
import ResultForm from '../components/ResultForm'
import Table from '../components/Table'
import { calculateGrade, calculatePercentage, formatDate, exportToCSV } from '../utils/calculations'
import { fetchStudents, fetchResults, fetchSubjects, createResult, updateResult, deleteResult } from '../services/api'

export default function ResultEntry() {
  const [results, setResults] = useState<Result[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingResult, setEditingResult] = useState<Result | null>(null)
  const [filterTerm, setFilterTerm] = useState('')
  const [selectedTerm, setSelectedTerm] = useState<string>('All')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [studentsData, resultsData, subjectsData] = await Promise.all([
        fetchStudents(),
        fetchResults(),
        fetchSubjects()
      ])
      setStudents(studentsData)
      setResults(resultsData)
      setSubjects(subjectsData)
    } catch (error) {
      console.error('Failed to load results data', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getResultDetails = (result: Result) => {
    const student = students.find((s) => s.id === result.studentId)
    const subject = subjects.find((sub) => sub.id === result.subjectId)
    const percentage = calculatePercentage(result.score, result.totalScore)
    const grade = calculateGrade(percentage)

    return {
      ...result,
      studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
      subjectName: subject?.name || 'Unknown Subject',
      percentage: `${percentage.toFixed(2)}%`,
      grade,
      scoreDisplay: `${result.score}/${result.totalScore}`,
    }
  }

  const filteredResults = useMemo(() => {
    return results
      .filter((result) => {
        const details = getResultDetails(result)
        const matchesFilter =
          details.studentName.toLowerCase().includes(filterTerm.toLowerCase()) ||
          details.subjectName.toLowerCase().includes(filterTerm.toLowerCase())

        const matchesTerm = selectedTerm === 'All' || result.term === selectedTerm

        return matchesFilter && matchesTerm
      })
      .map(getResultDetails)
  }, [results, students, subjects, filterTerm, selectedTerm])

  const handleAddResult = async (newResult: Omit<Result, 'id'>) => {
    try {
      await createResult(newResult)
      await loadData()
      setShowForm(false)
    } catch (error) {
      alert('Failed to add result')
    }
  }

  const handleUpdateResult = async (updatedResult: Result) => {
    try {
      await updateResult(updatedResult.id, updatedResult)
      await loadData()
      setEditingResult(null)
      setShowForm(false)
    } catch (error) {
      alert('Failed to update result')
    }
  }

  const handleSubmitResult = (result: Result | Omit<Result, 'id'>) => {
    if ('id' in result) {
      handleUpdateResult(result as Result)
    } else {
      handleAddResult(result as Omit<Result, 'id'>)
    }
  }

  const handleDeleteResult = async (id: string) => {
    if (confirm('Are you sure you want to delete this result?')) {
      try {
        await deleteResult(id)
        await loadData()
      } catch (error) {
        alert('Failed to delete result')
      }
    }
  }

  const handleExport = () => {
    const dataToExport = filteredResults.map((result) => ({
      'Student Name': result.studentName,
      Subject: result.subjectName,
      'Assessment Type': result.assessmentType,
      Score: result.score,
      'Total Score': result.totalScore,
      Percentage: result.percentage,
      Grade: result.grade,
      Term: result.term,
      'Academic Year': result.academicYear,
      'Date Recorded': formatDate(result.dateRecorded),
    }))
    exportToCSV(dataToExport, 'results_report')
  }

  const columns = [
    { key: 'studentName', label: 'Student Name' },
    { key: 'subjectName', label: 'Subject' },
    { key: 'assessmentType', label: 'Type' },
    { key: 'score', label: 'Score' },
    { key: 'grade', label: 'Grade' },
    { key: 'percentage', label: 'Percentage' },
    { key: 'term', label: 'Term' },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Result Entry</h1>
          <p className="text-gray-600 mt-2">Record and manage student results</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={20} />
            Export
          </button>
          <button
            onClick={() => {
              setEditingResult(null)
              setShowForm(true)
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add Result
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student or subject..."
                value={filterTerm}
                onChange={(e) => setFilterTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Term
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="input-field"
            >
              <option value="All">All Terms</option>
              <option value="First">First Term</option>
              <option value="Second">Second Term</option>
              <option value="Third">Third Term</option>
            </select>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <ResultForm
              onSubmit={handleSubmitResult}
              initialData={editingResult || undefined}
              onCancel={() => setShowForm(false)}
              isEditing={!!editingResult}
              students={students}
              subjects={subjects}
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card-lg">
        <Table
          columns={columns}
          data={filteredResults.map((result) => ({
            ...result,
            score: result.scoreDisplay,
            actions: (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingResult(result)
                    setShowForm(true)
                  }}
                  className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                  title="Edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteResult(result.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ),
          }))}
        />
        {filteredResults.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No results found</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="card-lg text-center">
          <p className="text-gray-600 text-sm">Total Results</p>
          <p className="text-3xl font-bold text-gray-900">{filteredResults.length}</p>
        </div>
        <div className="card-lg text-center">
          <p className="text-gray-600 text-sm">Average Score</p>
          <p className="text-3xl font-bold text-blue-600">
            {filteredResults.length > 0
              ? Math.round(
                  (filteredResults.reduce(
                    (sum, r) => sum + calculatePercentage(r.score, r.totalScore),
                    0
                  ) /
                    filteredResults.length) *
                    100
                ) / 100
              : 0}
            %
          </p>
        </div>
        <div className="card-lg text-center">
          <p className="text-gray-600 text-sm">Pass Rate</p>
          <p className="text-3xl font-bold text-green-600">
            {filteredResults.length > 0
              ? Math.round(
                  (filteredResults.filter(
                    (r) =>
                      calculatePercentage(r.score, r.totalScore) >= 60
                  ).length /
                    filteredResults.length) *
                    100
                )
              : 0}
            %
          </p>
        </div>
      </div>
    </div>
  )
}
