/**
 * Error Handling Middleware
 * Provides consistent error responses across the API
 */

import { Request, Response, NextFunction } from 'express'

export interface AppError extends Error {
  status?: number
  code?: string
  details?: any
}

/**
 * Global error handler middleware
 * Should be last middleware in chain
 */
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500
  const code = err.code || 'INTERNAL_ERROR'
  const message = err.message || 'An unexpected error occurred'

  // Log error for debugging
  console.error('[ERROR]', {
    timestamp: new Date().toISOString(),
    status,
    code,
    message,
    path: req.path,
    method: req.method,
    ip: req.ip,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  })

  // Prevent exposing sensitive information in production
  const clientMessage = process.env.NODE_ENV === 'production' 
    ? getPublicErrorMessage(status)
    : message

  res.status(status).json({
    error: clientMessage,
    code,
    ...(process.env.NODE_ENV === 'development' && { details: err.details }),
  })
}

/**
 * Get user-friendly error messages
 */
function getPublicErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.'
    case 401:
      return 'Authentication required. Please log in.'
    case 403:
      return 'You do not have permission to perform this action.'
    case 404:
      return 'The requested resource was not found.'
    case 429:
      return 'Too many requests. Please try again later.'
    case 500:
      return 'An internal server error occurred. Please try again later.'
    case 503:
      return 'Service temporarily unavailable. Please try again later.'
    default:
      return 'An error occurred. Please try again later.'
  }
}

/**
 * 404 handler for undefined routes
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error: AppError = new Error(`Route not found: ${req.method} ${req.path}`)
  error.status = 404
  error.code = 'NOT_FOUND'
  next(error)
}

/**
 * Async route wrapper
 * Catches errors in async route handlers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/**
 * Validation error helper
 */
export class ValidationError extends Error implements AppError {
  status = 400
  code = 'VALIDATION_ERROR'
  details: any

  constructor(message: string, details?: any) {
    super(message)
    this.details = details
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

/**
 * Authentication error helper
 */
export class AuthError extends Error implements AppError {
  status = 401
  code = 'AUTH_ERROR'
  details: any

  constructor(message: string, code: string = 'AUTH_ERROR', details?: any) {
    super(message)
    this.code = code
    this.details = details
    Object.setPrototypeOf(this, AuthError.prototype)
  }
}

/**
 * Authorization error helper
 */
export class AuthorizationError extends Error implements AppError {
  status = 403
  code = 'FORBIDDEN'
  details: any

  constructor(message: string = 'Access denied', details?: any) {
    super(message)
    this.details = details
    Object.setPrototypeOf(this, AuthorizationError.prototype)
  }
}

/**
 * Not found error helper
 */
export class NotFoundError extends Error implements AppError {
  status = 404
  code = 'NOT_FOUND'
  details: any

  constructor(resource: string, id?: string) {
    const message = id ? `${resource} with ID ${id} not found` : `${resource} not found`
    super(message)
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

/**
 * Conflict error helper (e.g., duplicate entry)
 */
export class ConflictError extends Error implements AppError {
  status = 409
  code = 'CONFLICT'
  details: any

  constructor(message: string, details?: any) {
    super(message)
    this.details = details
    Object.setPrototypeOf(this, ConflictError.prototype)
  }
}
