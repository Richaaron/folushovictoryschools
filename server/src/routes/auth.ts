import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { Teacher } from '../models/Teacher'
import { Student } from '../models/Student'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key'

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    let user: any = await User.findOne({ email })
    if (user) {
      const isMatch = await user.comparePassword(password)
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' })
    }

    if (!user) {
      user = await Teacher.findOne({ $or: [{ email }, { username: email }] })
      if (user) {
        const isMatch = await user.comparePassword(password)
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' })
      }
    }
    
    if (!user) {
      const student = await Student.findOne({ parentUsername: email })
      if (student) {
        const isMatch = await student.compareParentPassword(password)
        if (isMatch) {
          const token = jwt.sign(
            { id: student._id, role: 'Parent' },
            JWT_SECRET,
            { expiresIn: '1d' }
          )
          return res.json({
            token,
            user: {
              role: 'Parent',
              email: student.email,
              name: `${student.parentName} (Parent of ${student.firstName})`,
              studentId: student._id,
              childName: student.firstName,
            }
          })
        }
      }
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'Login failed' })
  }
})

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body
    
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ error: 'Email already exists' })
    }

    const user = new User({ email, password, name, role })
    await user.save()
    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    })
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' })
  }
})

export default router
