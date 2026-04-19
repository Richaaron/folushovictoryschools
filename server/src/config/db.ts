import mongoose from 'mongoose'
import { getEnvConfig } from '../utils/envConfig.js'

export async function connectDB(): Promise<typeof mongoose> {
  try {
    const config = getEnvConfig()
    const conn = await mongoose.connect(config.MONGO_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

export default mongoose
