# Security Quick Reference Card

A quick guide for developers implementing or using the Folusho Result System.

## 🔐 Password Requirements

```
✓ Minimum 12 characters
✓ At least one UPPERCASE letter (A-Z)
✓ At least one lowercase letter (a-z)
✓ At least one number (0-9)
✓ At least one special character (!@#$%^&*)

Example: MySecure123!Pass
```

## 🔑 Environment Variables (Required)

```bash
JWT_SECRET=<min 32 random characters>
MONGO_URI=mongodb://user:pass@host/db
CORS_ORIGIN=http://localhost:5173
SMTP_HOST=smtp.example.com
SMTP_USER=your_email@example.com
SMTP_PASS=your_password
```

## 🛡️ Rate Limits

| Endpoint | Limit | Window |
|---|---|---|
| **Login** | 5 attempts | 15 minutes |
| **Register** | 5 attempts | 15 minutes |
| **General API** | 100 requests | 15 minutes |
| **Sensitive** | 20 requests | 15 minutes |

## 🔄 Authentication Flow

```
1. User submits email + password
2. Input validation (format, length)
3. Rate limit check (5/15min)
4. Database lookup (timing-safe)
5. Bcrypt password comparison
6. JWT token generation (7 day expiry)
7. Generic error response (if fails)
8. Token sent to client
```

## 🚫 Error Codes

| Code | HTTP Status | Meaning |
|---|---|---|
| `INVALID_CREDENTIALS` | 401 | Email/password mismatch |
| `INVALID_EMAIL` | 400 | Email format invalid |
| `WEAK_PASSWORD` | 400 | Password doesn't meet requirements |
| `EMAIL_EXISTS` | 409 | Email already registered |
| `NO_TOKEN` | 401 | Authorization header missing |
| `EXPIRED_TOKEN` | 401 | Token expired |
| `INVALID_TOKEN` | 401 | Token format invalid |
| `FORBIDDEN` | 403 | User lacks permissions |
| `NOT_FOUND` | 404 | Resource not found |

## 📡 API Request Format

```typescript
// All authenticated requests must include:
fetch(`${API_URL}/endpoint`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // Required!
  },
  body: JSON.stringify(data)
})
```

## 🛡️ Security Headers (Automatic)

Every response includes:
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block` - Enables browser XSS filter
- `Content-Security-Policy: ...` - Restricts resource loading
- `Strict-Transport-Security: ...` - Enforces HTTPS (production)

## 🔍 Input Validation

### Email
```
Format: RFC-compliant (user@domain.com)
Max length: 255 characters
```

### Name
```
Allowed: Letters, spaces, hyphens, apostrophes
Length: 2-100 characters
Example: Mary-Jane O'Brien
```

### Phone
```
Format: 10-15 digits (after removing formatting)
Example: +1-234-567-8900 or 2345678900
```

### Score
```
Format: Numeric, non-negative
Range: 0 to totalScore parameter
```

### Date
```
Format: ISO 8601 (YYYY-MM-DD)
Constraint: Cannot be in the future
```

## 🚀 Startup Verification

Application will refuse to start if:
- JWT_SECRET is missing or < 32 characters
- MONGO_URI is not set
- NODE_ENV is not recognized
- PORT is outside valid range (1-65535)

Fix these before starting the server!

## 📊 Monitoring

### Check Rate Limits
```bash
curl -I http://localhost:3001/api/health
# Look for RateLimit headers in response
```

### Verify Security Headers
```bash
curl -I http://localhost:3001/api/students
# Should see X-Frame-Options, CSP, etc.
```

### Test CORS
```bash
# Your frontend origin should work
# Other origins should be rejected
```

## 🔒 Best Practices

### DO ✅
- Use strong, unique passwords
- Store JWT in localStorage only
- Always send token in Authorization header
- Validate inputs before sending
- Use HTTPS in production
- Rotate credentials periodically
- Monitor logs for suspicious activity

### DON'T ❌
- Expose JWT secret in code
- Log sensitive data (passwords, tokens)
- Trust client-side validation alone
- Share credentials in email/Slack
- Use weak passwords
- Commit .env files
- Accept requests from unknown origins
- Store passwords in plain text

## 🧪 Quick Tests

### Test Login Rate Limiting
```bash
# Should succeed
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!@#"}'

# Repeat 5 times in quick succession
# 6th attempt should be rate limited
```

### Test Password Validation
```bash
# All of these should fail validation:
- "short" (too short)
- "NoNumbers!@#" (no numbers)
- "nonumbers123" (no special chars)
- "NOLOWERCASE123!@#" (no lowercase)
```

### Test CORS
```bash
# Should work (configured origin)
curl -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -X OPTIONS http://localhost:3001/api/students

# Should fail (different origin)
curl -H "Origin: http://evil.com" \
  -H "Access-Control-Request-Method: GET" \
  -X OPTIONS http://localhost:3001/api/students
```

## 📖 Read More

- [Full Security Guide](SECURITY.md)
- [Security Implementation Summary](SECURITY_IMPLEMENTATION_SUMMARY.md)
- [Frontend Security Guide](FRONTEND_SECURITY.md)

## 🆘 Troubleshooting

### "JWT_SECRET must be at least 32 characters"
```bash
# Generate a new secret:
openssl rand -base64 32
# Copy to .env file as JWT_SECRET
```

### "MongoDB connection error"
```bash
# Verify MongoDB is running
# Check MONGO_URI format
# Ensure credentials are correct
```

### "CORS blocked"
```bash
# Verify CORS_ORIGIN matches your frontend URL
# Check Origin header in browser DevTools
# Ensure server is restarted after env changes
```

### "Rate limit exceeded"
```bash
# Wait 15 minutes, or
# Restart the server to reset limits (development only!)
```

## 📞 Questions?

1. Check [SECURITY.md](SECURITY.md) for detailed documentation
2. Review [SECURITY_IMPLEMENTATION_SUMMARY.md](SECURITY_IMPLEMENTATION_SUMMARY.md) for overview
3. Check [FRONTEND_SECURITY.md](FRONTEND_SECURITY.md) for client-side guidance

---

**Last Updated**: April 17, 2026
**Version**: 1.0
