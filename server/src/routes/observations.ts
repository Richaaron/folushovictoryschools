import { Router } from 'express'
import { Observation } from '../models/Observation.js'
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js'

const router = Router()

// Get observations for a student
router.get('/', authenticate, async (req, res) => {
  try {
    const { studentId, term, academicYear } = req.query
    const filter: any = {}
    if (studentId) filter.studentId = studentId
    if (term) filter.term = term
    if (academicYear) filter.academicYear = academicYear

    const observations = await Observation.find(filter)
    res.json(observations)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch observations' })
  }
})

// Save or update observation
router.post('/', authenticate, authorize(['Admin', 'Teacher']), async (req: AuthRequest, res) => {
  try {
    const { studentId, term, academicYear } = req.body
    const recordedBy = req.user?.id

    const observation = await Observation.findOneAndUpdate(
      { studentId, term, academicYear },
      { ...req.body, recordedBy },
      { upsert: true, new: true }
    )
    res.json(observation)
  } catch (error) {
    res.status(400).json({ error: 'Failed to save observation' })
  }
})

export default router
