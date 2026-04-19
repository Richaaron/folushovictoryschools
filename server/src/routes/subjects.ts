import { Router } from 'express'
import { Subject } from '../models/Subject.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticate, async (req, res) => {
  try {
    const subjects = await Subject.find()
    res.json(subjects)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subjects' })
  }
})

router.get('/:id', authenticate, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
    if (!subject) return res.status(404).json({ error: 'Subject not found' })
    res.json(subject)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subject' })
  }
})

router.post('/', authenticate, authorize(['Admin']), async (req, res) => {
  try {
    const subject = new Subject(req.body)
    await subject.save()
    res.status(201).json(subject)
  } catch (error) {
    res.status(400).json({ error: 'Failed to create subject' })
  }
})

router.put('/:id', authenticate, authorize(['Admin']), async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!subject) return res.status(404).json({ error: 'Subject not found' })
    res.json(subject)
  } catch (error) {
    res.status(400).json({ error: 'Failed to update subject' })
  }
})

router.delete('/:id', authenticate, authorize(['Admin']), async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id)
    if (!subject) return res.status(404).json({ error: 'Subject not found' })
    res.json({ message: 'Subject deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete subject' })
  }
})

export default router
