/**
 * Environment Variables Validation
 * Ensures all required environment variables are set
 */

export interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test'
  PORT: number
  MONGO_URI: string
  JWT_SECRET: string
  JWT_EXPIRY: string
  CORS_ORIGIN: string
  SMTP_HOST: string
  SMTP_PORT: number
  SMTP_USER: string
  SMTP_PASS: string
  SMTP_FROM: string
  FRONTEND_URL: string
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error'
  MAX_LOGIN_ATTEMPTS: number
  LOGIN_ATTEMPT_WINDOW_MS: number
  SESSION_TIMEOUT_MS: number
}

/**
 * Validates and loads environment variables
 * Throws error if required variables are missing or invalid
 */
export function validateEnv(): EnvConfig {
  const requiredVars: (keyof EnvConfig)[] = [
    'MONGO_URI',
    'JWT_SECRET',
    'SMTP_HOST',
    'SMTP_USER',
    'SMTP_PASS',
  ]
  
  const missingVars: string[] = []
  
  console.log('[ENV] Checking required variables...')
  console.log('[ENV] process.env keys with ENV prefix:', Object.keys(process.env).filter(k => k.toUpperCase() === k && (k.includes('MONGO') || k.includes('JWT') || k.includes('SMTP') || k.includes('PORT') || k.includes('NODE'))))
  
  for (const varName of requiredVars) {
    const value = process.env[varName]
    console.log(`[ENV] ${varName}: ${value ? 'present' : 'MISSING'}`)
    if (!value) {
      missingVars.push(varName)
    }
  }
  
  if (missingVars.length > 0) {
    console.error('[ENV] All available env vars:', Object.keys(process.env).slice(0, 20))
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }
  
  // Validate JWT_SECRET strength
  const jwtSecret = process.env.JWT_SECRET || ''
  if (jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long')
  }
  
  // Validate NODE_ENV
  const validEnv = ['development', 'production', 'test']
  const nodeEnv = (process.env.NODE_ENV || 'development') as string
  if (!validEnv.includes(nodeEnv)) {
    throw new Error(`NODE_ENV must be one of: ${validEnv.join(', ')}`)
  }
  
  const config: EnvConfig = {
    NODE_ENV: nodeEnv as 'development' | 'production' | 'test',
    PORT: parseInt(process.env.PORT || '3001', 10),
    MONGO_URI: process.env.MONGO_URI!,
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
    SMTP_HOST: process.env.SMTP_HOST!,
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
    SMTP_USER: process.env.SMTP_USER!,
    SMTP_PASS: process.env.SMTP_PASS!,
    SMTP_FROM: process.env.SMTP_FROM || 'noreply@folusho.com',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
    LOG_LEVEL: (process.env.LOG_LEVEL || 'info') as 'debug' | 'info' | 'warn' | 'error',
    MAX_LOGIN_ATTEMPTS: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
    LOGIN_ATTEMPT_WINDOW_MS: parseInt(process.env.LOGIN_ATTEMPT_WINDOW_MS || '900000', 10),
    SESSION_TIMEOUT_MS: parseInt(process.env.SESSION_TIMEOUT_MS || '86400000', 10),
  }
  
  // Validate PORT
  if (config.PORT < 1 || config.PORT > 65535) {
    throw new Error('PORT must be between 1 and 65535')
  }
  
  // Validate SMTP_PORT
  if (config.SMTP_PORT < 1 || config.SMTP_PORT > 65535) {
    throw new Error('SMTP_PORT must be between 1 and 65535')
  }
  
  // Warn if in development
  if (config.NODE_ENV === 'development') {
    console.warn('⚠️  Running in DEVELOPMENT mode - do not use in production!')
  }
  
  return config
}

/**
 * Get validated environment configuration
 * Cached to avoid re-validation
 */
let cachedConfig: EnvConfig | null = null

export function getEnvConfig(): EnvConfig {
  if (!cachedConfig) {
    cachedConfig = validateEnv()
  }
  return cachedConfig
}

export default getEnvConfig()
