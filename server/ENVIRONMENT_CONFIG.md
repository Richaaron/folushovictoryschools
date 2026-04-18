# Environment Configuration Guide - Folusho Reporting Sheet

## Overview

This guide explains how environment variables are loaded and validated in the Folusho Reporting Sheet backend. The system is designed to be robust and prevent common configuration errors.

## How Environment Loading Works

### Priority Order

Environment variables are loaded in this order (highest priority first):

1. **.env.local** - Local machine-specific overrides (not committed to git)
2. **.env** - Committed configuration file
3. **.env.development** - Development template with documentation
4. **process.env** - System environment variables
5. **Hardcoded defaults** - Development mode only

### Example Scenario

If you set `MONGO_URI` in multiple places:
```
.env.local: mongodb://production-db:27017/folusho  ← Used (highest priority)
.env: mongodb://localhost:27017/folusho
.env.development: mongodb://localhost:27017/folusho
System env: not set
```

## Configuration Files

### .env.development (Committed)
- **Purpose**: Template for all configuration options
- **Visibility**: Part of git repository
- **Usage**: Reference for available settings and their defaults
- **Do Not**: Store sensitive production secrets here

### .env (Committed)
- **Purpose**: Development configuration
- **Visibility**: Part of git repository
- **Usage**: Default settings for all developers
- **Note**: Contains development defaults only

### .env.local (NOT Committed)
- **Purpose**: Machine-specific overrides
- **Visibility**: `.gitignore` (never committed)
- **Usage**: Override values for your local environment
- **Example**: Production database connection for testing

## Setting Up Your Environment

### For New Developers

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. No additional setup needed! The system uses development defaults.

### If You Need Custom Settings

Create `.env.local` and override only what you need:

```bash
# .env.local (example)
MONGO_URI=mongodb://your-local-db:27017/folusho
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Environment Validation

### Development Mode

✅ **What Happens:**
- Allows missing environment variables
- Uses hardcoded development defaults
- Provides warnings for weak JWT_SECRET (< 32 chars)
- Shows detailed logging for troubleshooting

### Production Mode

🔒 **What Happens:**
- **Rejects** missing environment variables
- **Requires** JWT_SECRET to be 32+ characters
- **Requires** all critical variables
- **Fails fast** on startup if configuration is invalid

### How to Enable Production Mode

```bash
# On Windows
set NODE_ENV=production
npm run dev

# On Linux/Mac
export NODE_ENV=production
npm run dev
```

## Troubleshooting

### "Missing required environment variables" Error

**Problem**: Server won't start because environment variables aren't loaded.

**Solutions**:

1. **Check .env file exists**
   ```bash
   # Windows
   dir server\.env
   
   # Linux/Mac
   ls -la server/.env
   ```

2. **Verify .env file content**
   ```bash
   cat server/.env
   ```

3. **Check file location**
   - Must be in `server/` directory (not the root)
   - Must be named exactly `.env` (not `env.txt` or `.env.txt`)

4. **Create .env from template**
   ```bash
   cp server/.env.development server/.env
   ```

### "Port already in use" Error

**Problem**: `EADDRINUSE: address already in use :::3001`

**Solutions**:

1. **Kill existing process** (Windows):
   ```bash
   netstat -ano | findstr :3001
   taskkill /PID <PID> /F
   ```

2. **Or use different port**:
   ```bash
   # In .env.local
   PORT=3002
   ```

3. **Wait for the port to be released** (sometimes takes 30 seconds)

### "MongoDB Connection Failed" Error

**Problem**: Server can't connect to MongoDB

**Solutions**:

1. **Start MongoDB locally** (Windows):
   ```bash
   mongod
   ```

2. **Or use Docker**:
   ```bash
   docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo
   ```

3. **Or update MONGO_URI** in `.env.local`:
   ```
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/folusho
   ```

### Startup Diagnostic Information

When the server starts, it displays diagnostic information:

```
[ENV-LOADER] ========== DIAGNOSTICS ==========
[ENV-LOADER] Server Root: C:\Users\...\server
[ENV-LOADER] NODE_ENV: development
[ENV-LOADER] Available .env files:
  ✓ .env.local
  ✓ .env
  ✓ .env.development
```

Use this to verify your configuration is correct.

## Variable Reference

### Core Variables (Always Required)

| Variable | Description | Example | Min Length |
|----------|-------------|---------|-----------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/folusho` | N/A |
| `JWT_SECRET` | Secret for signing JWT tokens | 32+ random chars | 32 (prod) |
| `SMTP_HOST` | Email server hostname | `smtp.gmail.com` | N/A |
| `SMTP_USER` | Email account username | `user@gmail.com` | N/A |
| `SMTP_PASS` | Email account password/app password | `app-password` | N/A |

### Server Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Runtime environment |
| `PORT` | `3001` | Server port |
| `FRONTEND_URL` | `http://localhost:5173` | Frontend base URL |
| `CORS_ORIGIN` | `http://localhost:5173` | CORS allowed origin |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SMTP_PORT` | `587` | SMTP port (TLS) |
| `SMTP_FROM` | `noreply@folusho.com` | Email from address |
| `JWT_EXPIRY` | `7d` | JWT token expiration |
| `LOG_LEVEL` | `info` | Logging level |
| `MAX_LOGIN_ATTEMPTS` | `5` | Failed login attempts before lockout |
| `LOGIN_ATTEMPT_WINDOW_MS` | `900000` | Time window for login attempts (15 min) |
| `SESSION_TIMEOUT_MS` | `86400000` | Session timeout (24 hours) |

## Best Practices

### ✅ Do's

- Keep `.env.development` committed with development defaults
- Use `.env.local` for personal overrides
- Document all new environment variables
- Validate configuration on server startup
- Use environment-specific defaults for each mode
- Store production secrets securely (Key Vault, Secrets Manager, etc.)

### ❌ Don'ts

- Don't commit `.env.local` file
- Don't commit production credentials to git
- Don't modify `.env.development` for personal use (use `.env.local` instead)
- Don't hardcode configuration in code
- Don't use weak secrets in production
- Don't ignore validation errors in production mode

## For Production Deployment

1. Set `NODE_ENV=production`
2. Provide all required environment variables:
   ```bash
   MONGO_URI=<production-mongo-uri>
   JWT_SECRET=<strong-secret-32+-chars>
   SMTP_HOST=<smtp-host>
   SMTP_USER=<email>
   SMTP_PASS=<password>
   ```
3. Verify the startup diagnostics show all ✓ checks
4. Review server logs for any warnings

## Getting Help

If you encounter configuration issues:

1. Check the **Startup Diagnostic Information** printed when the server starts
2. Review the **Troubleshooting** section above
3. Check `.env.development` for available options
4. Ensure `.env` or `.env.local` exists in the `server/` directory
5. Verify MongoDB is running locally or provide remote connection string
