import mongoose from 'mongoose'
import { getEnvConfig } from '../utils/envConfig.js'

export async function connectDB(): Promise<typeof mongoose> {
  try {
    const config = getEnvConfig()
    
    // Set connection options for better reliability
    const conn = await mongoose.connect(config.MONGO_URI, {
      serverSelectionTimeoutMS: 15000, // 15s timeout for cloud databases
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
    })
    
    console.log(`[DATABASE] ✓ MongoDB Connected: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error('\n[DATABASE] ❌ CONNECTION ERROR!')
    if (error instanceof Error) {
      console.error(`[DATABASE] Message: ${error.message}`)
      if (error.message.includes('IP not whitelisted')) {
        console.error('[DATABASE] ACTION REQUIRED: You must whitelist all IPs (0.0.0.0/0) in MongoDB Atlas.')
      }
      if (error.message.includes('Authentication failed')) {
        console.error('[DATABASE] ACTION REQUIRED: Check your MONGO_URI username and password.')
      }
    } else {
      console.error(`[DATABASE] Unknown error: ${String(error)}`)
    }
    process.exit(1)
  }
}

export default mongoose
