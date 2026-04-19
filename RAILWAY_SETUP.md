# Deploying to Railway (Always-On Backend)

Railway is an excellent choice for hosting your Node.js backend. It's fast, reliable, and handles deployments automatically from GitHub.

## Steps to Deploy

1. **Create a Railway Account**
   - Go to [railway.app](https://railway.app) and sign up (using your GitHub account is easiest).

2. **Create a New Project**
   - Click **"New Project"**.
   - Select **"Deploy from GitHub repo"**.
   - Choose your repository: `Richaaron/folushovictoryschools`.

3. **Configure the Backend Service**
   - Once the repo is linked, Railway will try to deploy the root folder. We need to tell it to use the `server` folder:
   - Click on the service in the Railway dashboard.
   - Go to **Settings**.
   - Look for **"Root Directory"** and change it to `/server`.
   - Railway will now correctly find your `package.json` and build your backend.

4. **Add Environment Variables**
   - Go to the **Variables** tab for your service and add these:
     - `NODE_ENV`: `production`
     - `PORT`: `10000`
     - `MONGO_URI`: (Your MongoDB Atlas connection string)
     - `JWT_SECRET`: (Your secret key)
     - `CORS_ORIGIN`: (Your Vercel frontend URL, e.g., `https://your-app.vercel.app`)
     - `SMTP_HOST`: `smtp.gmail.com`
     - `SMTP_PORT`: `587`
     - `SMTP_USER`: (Your email)
     - `SMTP_PASS`: (Your email app password)
     - `SMTP_FROM`: (Your email)

5. **Wait for Deployment**
   - Railway will automatically start a new build. You can watch the progress in the **Deployments** tab.
   - Once finished, you will see a URL like `https://folusho-backend-production.up.railway.app`.

6. **Update Frontend**
   - Go to your Vercel dashboard.
   - Update the `VITE_API_URL` environment variable to your new Railway URL (ensure it ends with `/api`).
   - Re-deploy the frontend on Vercel.

## Why Railway?
- **Fast Builds**: Railway's build system is very fast.
- **Reliability**: It stays awake as long as you have trial credits (they give you $5 to start, which lasts a long time for small apps).
- **Easy Management**: The dashboard is very clear and shows you exactly what's happening with your server.
