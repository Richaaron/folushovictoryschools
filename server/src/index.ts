import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { connectDB } from './config/db'
import { getEnvConfig } from './utils/envConfig'
import {
  securityHeaders,
  generalLimiter,
  requestLogger,
  sanitizeInput,
} from './middleware/security'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'
import studentRoutes from './routes/students'
import teacherRoutes from './routes/teachers'
import subjectRoutes from './routes/subjects'
import resultRoutes from './routes/results'
import authRoutes from './routes/auth'
import attendanceRoutes from './routes/attendance'
import configRoutes from './routes/config'
import observationRoutes from './routes/observations'
import notificationRoutes from './routes/notifications'

// Load environment variables
console.log('[STARTUP] Loading environment variables...')
dotenv.config()
console.log('[STARTUP] Environment variables loaded')

// Validate environment variables
const envConfig = getEnvConfig()

const app = express()
const PORT = envConfig.PORT

// Security middleware - apply first
app.use(helmet())
app.use(securityHeaders)

// CORS with restrictions
app.use(
  cors({
    origin: envConfig.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// Body parsing and sanitization
app.use(express.json({ limit: '10mb' }))
app.use(sanitizeInput)

// Request logging and rate limiting
app.use(requestLogger)
app.use(generalLimiter)

app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/teachers', teacherRoutes)
app.use('/api/subjects', subjectRoutes)
app.use('/api/results', resultRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/config', configRoutes)
app.use('/api/observations', observationRoutes)
app.use('/api/notifications', notificationRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// 404 handler - must come after all routes
app.use(notFoundHandler)

// Error handler - must be last
app.use(errorHandler)

async function startServer() {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
    console.log(`Environment: ${envConfig.NODE_ENV}`)
    console.log('✓ Security features enabled')
  })
}

startServer()