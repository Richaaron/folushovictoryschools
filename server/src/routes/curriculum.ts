import { Router } from 'express'
import { Curriculum } from '../models/Curriculum.js'
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js'

const router = Router()

// Get all curriculums (accessible to all authenticated users)
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { level, status } = req.query
    const filter: any = {}
    
    if (level) filter.level = level
    if (status) filter.status = status

    const curriculums = await Curriculum.find(filter).populate('subjects').sort({ implementationDate: -1 })
    res.json(curriculums)
  } catch (error) {
    console.error('Error fetching curriculums:', error)
    res.status(500).json({ error: 'Failed to fetch curriculums' })
  }
})

// Get curriculum by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const curriculum = await Curriculum.findById(req.params.id).populate('subjects')
    if (!curriculum) return res.status(404).json({ error: 'Curriculum not found' })
    res.json(curriculum)
  } catch (error) {
    console.error('Error fetching curriculum:', error)
    res.status(500).json({ error: 'Failed to fetch curriculum' })
  }
})

// Create new curriculum (Admin only)
router.post('/', authenticate, authorize(['Admin']), async (req: AuthRequest, res) => {
  try {
    const { name, version, level, yearsOfStudy, subjects, implementationDate, description, curriculum, status } = req.body

    if (!name || !version || !level || !implementationDate) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const newCurriculum = new Curriculum({
      name,
      version,
      level,
      yearsOfStudy,
      subjects: subjects || [],
      implementationDate,
      description,
      curriculum: curriculum || 'NIGERIAN',
      status: status || 'DRAFT',
      createdBy: req.user?.email || 'admin',
    })

    await newCurriculum.save()
    res.status(201).json(newCurriculum)
  } catch (error) {
    console.error('Error creating curriculum:', error)
    res.status(400).json({ error: 'Failed to create curriculum' })
  }
})

// Update curriculum (Admin only)
router.put('/:id', authenticate, authorize(['Admin']), async (req: AuthRequest, res) => {
  try {
    const { name, version, level, yearsOfStudy, subjects, implementationDate, revisionDate, description, status } = req.body

    const curriculum = await Curriculum.findByIdAndUpdate(
      req.params.id,
      {
        name,
        version,
        level,
        yearsOfStudy,
        subjects,
        implementationDate,
        revisionDate,
        description,
        status,
      },
      { new: true }
    )

    if (!curriculum) return res.status(404).json({ error: 'Curriculum not found' })
    res.json(curriculum)
  } catch (error) {
    console.error('Error updating curriculum:', error)
    res.status(400).json({ error: 'Failed to update curriculum' })
  }
})

// Delete curriculum (Admin only)
router.delete('/:id', authenticate, authorize(['Admin']), async (req: AuthRequest, res) => {
  try {
    const curriculum = await Curriculum.findByIdAndDelete(req.params.id)
    if (!curriculum) return res.status(404).json({ error: 'Curriculum not found' })
    res.json({ message: 'Curriculum deleted successfully' })
  } catch (error) {
    console.error('Error deleting curriculum:', error)
    res.status(500).json({ error: 'Failed to delete curriculum' })
  }
})

// Get curriculums by level
router.get('/level/:level', authenticate, async (req, res) => {
  try {
    const curriculums = await Curriculum.find({ 
      level: req.params.level,
      status: 'ACTIVE'
    })
    res.json(curriculums)
  } catch (error) {
    console.error('Error fetching curriculums by level:', error)
    res.status(500).json({ error: 'Failed to fetch curriculums' })
  }
})

export default router
