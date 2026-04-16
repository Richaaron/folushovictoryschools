import { Router } from 'express'
import { SchoolConfig } from '../models/SchoolConfig'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

router.get('/', async (req, res) => {
  try {
    let config = await SchoolConfig.findOne()
    if (!config) {
      config = new SchoolConfig({
        currentTerm: '1st Term',
        currentAcademicYear: '2023/2024',
        availableClasses: ['Pre-Nursery', 'Nursery 1', 'Nursery 2', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Secondary 1', 'Secondary 2', 'Secondary 3']
      })
      await config.save()
    }
    res.json(config)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch school config' })
  }
})

router.put('/', authenticate, authorize(['Admin']), async (req, res) => {
  try {
    const config = await SchoolConfig.findOneAndUpdate({}, req.body, { new: true, upsert: true })
    res.json(config)
  } catch (error) {
    res.status(400).json({ error: 'Failed to update school config' })
  }
})

export default router
