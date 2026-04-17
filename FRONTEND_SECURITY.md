/**
 * Frontend Security Best Practices Guide
 * 
 * This file documents frontend security considerations and implementations
 * for the Folusho Result System
 */

# Frontend Security Best Practices

## 1. Authentication Token Management

### Current Implementation: localStorage
- **Pros**: Simple, persistent across page reloads, accessible to JavaScript
- **Cons**: Vulnerable to XSS attacks

### Security Measures Implemented:
1. **Token Validation**: Check token expiry before use
2. **Secure Headers**: Always send Authorization header over HTTPS
3. **Token Rotation**: Consider refreshing tokens periodically
4. **Logout on Error**: Clear tokens when receiving 401 responses

### Best Practices:
```typescript
// DO:
const token = localStorage.getItem('authSession')
const headers = {
  'Authorization': `Bearer ${token}`
}

// DON'T:
const token = localStorage.getItem('authSession')
console.log(token) // Never log tokens
sessionStorage.setItem('token', token) // Avoid multiple storage locations
```

## 2. XSS (Cross-Site Scripting) Prevention

### Current Protections:
1. **Content Security Policy (CSP)**: Server sets strict CSP headers
2. **Input Sanitization**: Server sanitizes all inputs
3. **Framework Escaping**: React auto-escapes JSX by default

### Frontend Guidelines:
```typescript
// DO: Let React handle escaping
<div>{userInput}</div>

// DON'T: Use dangerouslySetInnerHTML unless absolutely necessary
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// If you must use dangerouslySetInnerHTML:
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userInput) 
}} />
```

## 3. CSRF (Cross-Site Request Forgery) Prevention

### Current Implementation:
- SameSite cookies (via CORS)
- Origin validation
- Token-based authentication

### Frontend Practices:
```typescript
// Always include proper headers with requests
fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(data)
})
```

## 4. Sensitive Data Handling

### Never Store Locally:
- Passwords
- Credit card information
- Social security numbers
- Medical records (unencrypted)
- Admin credentials

### Secure Practices:
```typescript
// DO: Store only token and user metadata
const session = {
  token: 'jwt_token_here',
  user: {
    id: 'user_id',
    email: 'user@example.com',
    role: 'Teacher'
  }
}

// DON'T: Store full user object with sensitive data
const session = {
  user: { ...fullUserObject } // May contain sensitive data
}
```

## 5. Error Handling

### Secure Error Messages:
```typescript
// DO: Generic messages to user
toast.error('Login failed. Please try again.')

// DON'T: Expose system details
toast.error('User not found in database') // Reveals user enumeration
toast.error(`Error: ${error.message}`) // Exposes stack traces

// DO: Log detailed errors server-side
console.warn('[DEBUG] Login failed:', error) // Only in development
```

## 6. Input Validation on Frontend

### Validate Before Sending:
```typescript
// DO: Validate before API call
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(email)) {
  setError('Invalid email format')
  return
}

// Additional validation happens server-side
```

### Password Validation:
```typescript
function isStrongPassword(password: string): boolean {
  return (
    password.length >= 12 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  )
}
```

## 7. API Communication

### Always Use HTTPS
```typescript
// DO: HTTPS only in production
const apiUrl = import.meta.env.PROD 
  ? 'https://api.folusho.com'
  : 'http://localhost:3001'

// Enforce HTTPS in all production requests
if (import.meta.env.PROD && !apiUrl.startsWith('https')) {
  throw new Error('Production API must use HTTPS')
}
```

### Handle Sensitive Responses:
```typescript
// DO: Don't log sensitive data
const response = await fetch(url, options)
const data = await response.json()
// Log only non-sensitive parts
console.log('API response status:', response.status)

// DON'T:
console.log('Full response:', data) // May contain sensitive data
```

## 8. Session Management

### Implement Session Timeout:
```typescript
// Auto-logout after inactivity
const TIMEOUT_MS = 15 * 60 * 1000 // 15 minutes
let timeoutId: NodeJS.Timeout

function resetTimeout() {
  clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    logout() // Auto-logout on inactivity
    toast.info('Session expired due to inactivity')
  }, TIMEOUT_MS)
}

// Reset on user activity
document.addEventListener('mousemove', resetTimeout)
document.addEventListener('keypress', resetTimeout)
```

### Handle Token Expiry:
```typescript
async function fetchWithTokenRefresh(url: string, options: any) {
  let response = await fetch(url, options)
  
  if (response.status === 401) {
    // Token likely expired
    logout()
    window.location.href = '/login'
    return
  }
  
  return response
}
```

## 9. Local Storage Security

### Best Practices:
```typescript
// DO: Store only non-sensitive data
localStorage.setItem('user_preferences', JSON.stringify({
  theme: 'dark',
  language: 'en'
}))

// DO: Encrypt sensitive data if necessary
import CryptoJS from 'crypto-js'
const encrypted = CryptoJS.AES.encrypt(token, 'secret_key').toString()
localStorage.setItem('token', encrypted)

// DON'T: Store plain text passwords
localStorage.setItem('password', password)

// DO: Clear on logout
localStorage.removeItem('authSession')
localStorage.removeItem('token')
```

## 10. Form Security

### Prevent Autocomplete on Sensitive Fields:
```typescript
// DO: Disable autocomplete for passwords
<input 
  type="password" 
  autoComplete="off"
  name="password"
/>

// DO: Use secure name attributes
<input 
  type="password" 
  name="new_password"
  autoComplete="new-password"
/>
```

### Form Validation:
```typescript
function validateForm(data: FormData): ValidationErrors {
  const errors: ValidationErrors = {}
  
  if (!data.email) errors.email = 'Email required'
  if (!isValidEmail(data.email)) errors.email = 'Invalid email'
  
  if (!data.password) errors.password = 'Password required'
  if (!isStrongPassword(data.password)) {
    errors.password = 'Password does not meet requirements'
  }
  
  return errors
}
```

## 11. Third-Party Libraries Security

### Audit Dependencies:
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# See detailed security report
npm audit --json
```

### Use Trusted Libraries:
- Always use npm from official registry
- Pin versions in package.json
- Review package.json before installing
- Check library popularity and maintenance

## 12. API Error Responses Handling

### Handle 401 Unauthorized:
```typescript
if (response.status === 401) {
  // Token expired or invalid
  logout()
  window.location.href = '/login'
  return
}
```

### Handle 403 Forbidden:
```typescript
if (response.status === 403) {
  // User lacks permissions
  toast.error('You do not have permission to perform this action')
  return
}
```

### Handle Rate Limiting:
```typescript
if (response.status === 429) {
  // Too many requests
  toast.error('Too many requests. Please try again later.')
  // Disable submit button temporarily
  return
}
```

## 13. Logout Security

### Complete Logout Process:
```typescript
function logout() {
  // 1. Clear all session data
  localStorage.removeItem('authSession')
  sessionStorage.clear()
  
  // 2. Clear auth context state
  clearAuthState()
  
  // 3. Call server logout endpoint (if needed)
  fetch('/api/auth/logout', { method: 'POST' })
  
  // 4. Redirect to login
  window.location.href = '/login'
}
```

## 14. Browser Security Features

### Content Security Policy (CSP):
- Already set by server headers
- Restricts resource loading to trusted sources
- Prevents inline script execution

### X-Frame-Options:
- Already set to DENY by server
- Prevents clickjacking attacks

### Using These Headers:
```typescript
// Verify headers in browser DevTools
fetch('/api/health')
  .then(r => {
    console.log('CSP:', r.headers.get('content-security-policy'))
    console.log('X-Frame-Options:', r.headers.get('x-frame-options'))
  })
```

## 15. Security Testing Checklist

Before deploying frontend changes:

- [ ] No passwords logged to console
- [ ] No sensitive data in localStorage (except token)
- [ ] All API calls use HTTPS in production
- [ ] Token refresh/expiry handled correctly
- [ ] Logout clears all session data
- [ ] Error messages don't expose system details
- [ ] Form inputs validated before submission
- [ ] CSRF tokens used for state-changing operations
- [ ] XSS protection in place (no dangerouslySetInnerHTML)
- [ ] No hardcoded credentials in code
- [ ] npm audit shows no critical vulnerabilities
- [ ] Session timeout implemented
- [ ] 401/403 responses handled correctly

## Environment Variables Security

### Safe Configuration:
```typescript
// .env.production
VITE_API_URL=https://api.folusho.com
VITE_LOG_LEVEL=error
VITE_SESSION_TIMEOUT=900000

// DO: Use VITE_ prefix for frontend env vars
const apiUrl = import.meta.env.VITE_API_URL

// DON'T: Prefix with VITE_ if you want to hide from frontend
// Backend-only secrets should never be in frontend code
```

## Additional Resources

- [OWASP Frontend Security](https://owasp.org/www-community/)
- [React Security](https://react.dev/learn/security)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [CSP Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [HTTPS Everywhere](https://www.eff.org/https-everywhere/)

## Security Incident Response

If a security issue is discovered:

1. **Do not** push the issue to production
2. **Document** the issue and its impact
3. **Notify** the security team immediately
4. **Fix** the vulnerability
5. **Test** the fix thoroughly
6. **Review** security practices to prevent similar issues
