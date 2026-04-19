import { Router } from 'express'
import { Teacher } from '../models/Teacher.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticate, authorize(['Admin']), async (req, res) => {
  try {
    const teachers = await Teacher.find()
    res.json(teachers)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teachers' })
  }
})

router.get('/:id', authenticate, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' })
    res.json(teacher)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teacher' })
  }
})

router.post('/', authenticate, authorize(['Admin']), async (req, res) => {
  try {
    const teacher = new Teacher(req.body)
    await teacher.save()
    res.status(201).json(teacher)
  } catch (error) {
    res.status(400).json({ error: 'Failed to create teacher' })
  }
})

router.put('/:id', authenticate, authorize(['Admin']), async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' })
    res.json(teacher)
  } catch (error) {
    res.status(400).json({ error: 'Failed to update teacher' })
  }
})

router.delete('/:id', authenticate, authorize(['Admin']), async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id)
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' })
    res.json({ message: 'Teacher deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete teacher' })
  }
})

export default router
