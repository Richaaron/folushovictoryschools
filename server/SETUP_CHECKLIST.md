# Development Environment Setup Checklist

Follow this checklist to ensure your development environment is correctly configured.

## Prerequisites

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm 9+ installed (`npm --version`)
- [ ] Git installed and configured
- [ ] MongoDB 5.0+ installed OR Docker available

## Repository Setup

- [ ] Repository cloned to local machine
- [ ] In `server` directory: `npm install` completed successfully
- [ ] In root directory: `npm install` completed successfully

## Environment Configuration

### Step 1: Verify .env Files Exist

```bash
# Navigate to server directory
cd server

# Check for .env file
ls -la .env          # On Linux/Mac
dir .env             # On Windows

# Check for .env.development (optional but helpful)
ls -la .env.development
cat .env.development  # Read template
```

- [ ] `.env` file exists in `server/` directory
- [ ] `.env` file is readable

### Step 2: Verify Critical Environment Variables

```bash
# Check MONGO_URI
grep MONGO_URI .env

# Check JWT_SECRET
grep JWT_SECRET .env

# Check SMTP variables
grep SMTP_ .env
```

- [ ] `MONGO_URI` is present
- [ ] `JWT_SECRET` is present (preferably 32+ characters)
- [ ] `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` are present

### Step 3: MongoDB Setup

Choose ONE of these options:

#### Option A: Local MongoDB

```bash
# Windows: Install from https://www.mongodb.com/try/download/community
mongod

# Linux: Install via package manager
sudo systemctl start mongod

# Verify connection
mongodb://localhost:27017/folusho
```

- [ ] MongoDB server is running on `localhost:27017`
- [ ] Can connect using MongoDB Compass or mongosh

#### Option B: Docker

```bash
docker run -d \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  --name folusho-mongodb \
  mongo:latest
```

- [ ] Docker container is running
- [ ] Port 27017 is accessible

#### Option C: MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and get connection string
3. Update `.env.local`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/folusho
   ```

- [ ] MongoDB Atlas cluster is created
- [ ] Connection string added to `.env.local`
- [ ] Network access allows your IP

## Server Startup

### Step 1: Navigate to Server Directory

```bash
cd server
```

### Step 2: Install Dependencies

```bash
npm install
```

- [ ] No errors during installation
- [ ] `node_modules` folder created

### Step 3: Start Development Server

```bash
npm run dev
```

### Step 4: Verify Server Started Successfully

Look for output like:

```
╔════════════════════════════════════════════════════════════╗
║               ✓ Server Successfully Started                ║
╠════════════════════════════════════════════════════════════╣
║ URL: http://localhost:3001                                 ║
║ Environment: development                                   ║
║ Features:                                                  ║
║   ✓ Security headers enabled                               ║
║   ✓ CORS configured                                        ║
║   ✓ Rate limiting active                                   ║
║   ✓ MongoDB connected                                      ║
║   ✓ Authentication ready                                   ║
╚════════════════════════════════════════════════════════════╝
```

- [ ] Server logs show "✓ Server Successfully Started"
- [ ] MongoDB connection confirmed
- [ ] No errors in startup sequence

## Frontend Startup

### In a New Terminal

```bash
cd ..  # Go to root directory
npm run dev
```

- [ ] Frontend starts on `http://localhost:5173`
- [ ] Browser opens automatically
- [ ] No console errors in browser

## Verification

### Backend Health Check

```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{"status":"ok"}
```

- [ ] Responds with `{"status":"ok"}`

### Frontend Loading

```
Navigate to http://localhost:5173 in browser
```

- [ ] Page loads without errors
- [ ] No red errors in browser console
- [ ] Can see the Folusho Reporting Sheet interface

## Troubleshooting

### Issue: "Cannot find .env file"

```bash
# Check current directory
pwd

# Make sure you're in server directory
cd server

# List files
ls -la
```

**Solution**: Ensure `.env` exists in `server/` directory

### Issue: "Port 3001 already in use"

```bash
# Windows: Find and kill process
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or use different port in .env.local
echo "PORT=3002" >> .env.local
```

**Solution**: Free up port 3001 or use different port

### Issue: "MongoDB connection failed"

```bash
# Verify MONGO_URI
grep MONGO_URI .env

# Test connection (if local)
mongosh "mongodb://localhost:27017"
```

**Solution**: Start MongoDB server or update MONGO_URI

### Issue: "Environment variables not loading"

```bash
# Check .env file location
pwd  # Should show: .../server
ls -la .env

# Check file isn't empty
cat .env | head -5
```

**Solution**: Verify `.env` file exists and has content

## Development Tips

### Using .env.local for Personal Overrides

Create `server/.env.local` for settings specific to your machine:

```bash
# .env.local example
MONGO_URI=mongodb://my-dev-server:27017/folusho
PORT=3002
LOG_LEVEL=debug
```

Benefits:
- Never committed to git
- Overrides `.env` settings
- Safe for personal configuration

### Viewing Startup Diagnostics

When server starts, it shows diagnostics:

```
[ENV-LOADER] ========== DIAGNOSTICS ==========
[ENV-LOADER] Server Root: /path/to/server
[ENV-LOADER] NODE_ENV: development
[ENV-LOADER] Available .env files:
  ✓ .env
  ✓ .env.development
[ENV-LOADER] ===================================
```

Use this to verify configuration is correct.

## Common Workflows

### Changing Environment Variables

1. Stop the server (Ctrl+C)
2. Edit `.env` or create `.env.local`
3. Save file
4. Restart server (`npm run dev`)
5. Verify changes in startup logs

### Switching Between MongoDB Instances

1. Update `MONGO_URI` in `.env.local`
2. Restart server
3. Changes take effect immediately

### Using Different Configuration Per Developer

Each developer can create their own `.env.local`:

```bash
# Developer 1
MONGO_URI=mongodb://mongo-dev-1:27017/folusho

# Developer 2
MONGO_URI=mongodb://mongo-dev-2:27017/folusho

# Both use same .env but override with .env.local
```

## Next Steps

- [ ] Review [ENVIRONMENT_CONFIG.md](./ENVIRONMENT_CONFIG.md) for detailed configuration
- [ ] Check out the [README.md](../README.md) for project overview
- [ ] Run sample data seeding: `npm run seed`
- [ ] Open browser to http://localhost:5173

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run seed` | Seed sample data |
| `npm run test` | Run tests |

## Getting Help

If you're stuck:

1. Check the **Troubleshooting** section above
2. Review [ENVIRONMENT_CONFIG.md](./ENVIRONMENT_CONFIG.md)
3. Check server startup logs for errors
4. Verify all `.env` variables are correct
5. Ask the team on Slack/Discord
