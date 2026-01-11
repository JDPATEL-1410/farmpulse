# 🔧 Render Deployment Troubleshooting Guide

## ✅ Issue Fixed: Missing Build Script

### Problem
```
npm error Missing script: "build"
==> Build failed 😞
```

### Solution
Added a build script to `package.json`. The fix has been pushed to GitHub (commit: f79f7db).

### What Changed
```json
"scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js",
    "build": "echo 'No build step required for Express backend'"  // ← Added this
}
```

---

## 🚀 Next Steps for Render

### Option 1: Automatic Redeploy (Recommended)
If you have **auto-deploy enabled** in Render:
1. Render will automatically detect the new commit
2. It will start a new build within 1-2 minutes
3. Watch the logs in your Render dashboard

### Option 2: Manual Redeploy
If auto-deploy is not enabled:
1. Go to your Render dashboard
2. Find your `farmpulse-backend` service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**
4. Wait for the build to complete

---

## 📋 Correct Render Configuration

Make sure your Render service is configured with these settings:

### Basic Settings
- **Name:** `farmpulse-backend`
- **Region:** Oregon (or your preferred region)
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** Node

### Build & Deploy
- **Build Command:** `npm install` (NOT `npm install; npm run build`)
- **Start Command:** `npm start`

### Environment Variables
Make sure these are set in Render:

```env
MONGODB_URI=mongodb+srv://JD1410:jdpatel1410@cluster0.pcsjosu.mongodb.net/farmpulse?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production
PORT=5000
JWT_SECRET=<your-generated-secret>
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

---

## 🎯 Expected Build Output

After the fix, you should see:

```
==> Cloning from https://github.com/JDPATEL-1410/farmpulse
==> Checking out commit f79f7db...
==> Using Node.js version 22.16.0
==> Running build command 'npm install'...

added 113 packages, and audited 114 packages in 13s
found 0 vulnerabilities

==> Build successful! 🎉
==> Starting service with 'npm start'...

🚀 FarmPulse API Server running on port 5000
✅ MongoDB Atlas Connected: cluster0.pcsjosu.mongodb.net
📊 Database: farmpulse
```

---

## 🐛 Common Issues & Solutions

### 1. Build Still Failing
**Check:** Is Render using the correct build command?
- Go to Settings → Build & Deploy
- Build Command should be: `npm install` (not `npm install; npm run build`)
- If it's wrong, update it and redeploy

### 2. MongoDB Connection Error
**Symptoms:**
```
❌ MongoDB Atlas Connection Failed: MongoServerError: bad auth
```

**Solutions:**
- Verify MONGODB_URI is correct in environment variables
- Check MongoDB Atlas → Network Access → Allow 0.0.0.0/0
- Verify database user credentials

### 3. App Starts But Crashes
**Check the logs for:**
- Missing environment variables
- Port binding issues
- Module import errors

**Solution:**
- Review all environment variables are set
- Ensure PORT is set to 5000
- Check that all dependencies are in package.json

### 4. CORS Errors
**Symptoms:**
```
Access to fetch at 'https://farmpulse-backend.onrender.com' from origin 'http://localhost:5173' has been blocked by CORS
```

**Solution:**
- This is expected during development
- Update FRONTEND_URL after deploying frontend
- CORS is configured in server.js to use FRONTEND_URL

### 5. 503 Service Unavailable (Free Tier)
**Symptoms:**
- App works, then stops responding after 15 minutes

**Explanation:**
- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds

**Solutions:**
- This is normal behavior for free tier
- Consider upgrading to paid tier for production
- Or use a service like UptimeRobot to ping your API every 14 minutes

---

## ✅ Verification Checklist

After deployment succeeds:

- [ ] Build completes without errors
- [ ] Service shows "Live" status in Render dashboard
- [ ] Health endpoint works: `https://your-app.onrender.com/api/health`
- [ ] Response shows MongoDB connection: `"database": "MongoDB Atlas - Cluster0"`
- [ ] No errors in runtime logs

---

## 📊 Testing Your Deployment

### 1. Health Check
```bash
curl https://farmpulse-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "FarmPulse API is running",
  "database": "MongoDB Atlas - Cluster0",
  "timestamp": "2026-01-11T14:50:00.000Z"
}
```

### 2. Check All Endpoints
Visit your Render dashboard → Logs to see:
```
📋 Available endpoints:
   GET  /api/health
   POST /api/auth/register
   POST /api/auth/login
   GET  /api/farms
   POST /api/farms
   GET  /api/workers
   POST /api/workers
   ...
```

---

## 🔗 Useful Links

- **Your GitHub Repo:** https://github.com/JDPATEL-1410/farmpulse
- **Render Dashboard:** https://dashboard.render.com/
- **MongoDB Atlas:** https://cloud.mongodb.com/
- **Render Docs:** https://render.com/docs/troubleshooting-deploys

---

## 📞 Still Having Issues?

1. **Check Render Logs:**
   - Dashboard → Your Service → Logs tab
   - Look for error messages

2. **Check MongoDB Atlas:**
   - Verify Network Access allows 0.0.0.0/0
   - Check Database Access user permissions

3. **Verify Environment Variables:**
   - Dashboard → Your Service → Environment
   - Ensure all 6 variables are set correctly

4. **Review Recent Changes:**
   ```bash
   git log --oneline -5
   ```

---

**Last Updated:** January 11, 2026 - 20:20 IST
**Status:** ✅ Build script added, ready for deployment
