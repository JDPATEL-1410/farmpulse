# 🚀 Complete Render Deployment Guide
## Deploy Both Frontend & Backend on Render

**Last Updated:** January 11, 2026

---

## 📋 Overview

This guide will help you deploy:
1. **Backend API** (Node.js + Express + MongoDB)
2. **Frontend** (React + Vite)

Both will be hosted on Render's free tier.

---

## 🎯 Prerequisites

Before starting, ensure you have:

- ✅ GitHub repository: `https://github.com/JDPATEL-1410/farmpulse`
- ✅ MongoDB Atlas cluster configured
- ✅ MongoDB Network Access set to allow all IPs (0.0.0.0/0)
- ✅ Render account (sign up at https://render.com)

---

## Part 1: Deploy Backend API

### Step 1: Update Backend (If Needed)

Your backend is already configured! The latest commit includes:
- ✅ Build script added
- ✅ Environment variables template
- ✅ Render configuration file

### Step 2: Deploy Backend on Render

#### 2.1 Go to Render Dashboard

1. Visit: **https://dashboard.render.com/**
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Sign in with GitHub"**
4. Authorize Render to access your repositories

#### 2.2 Create New Web Service

1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect a repository"**
4. Find and select: **`JDPATEL-1410/farmpulse`**
5. Click **"Connect"**

#### 2.3 Configure Backend Service

Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `farmpulse-backend` |
| **Region** | Oregon (or closest to you) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

#### 2.4 Add Environment Variables

Click **"Advanced"** → Scroll to **"Environment Variables"**

Add these variables (click "Add Environment Variable" for each):

```env
MONGODB_URI=mongodb+srv://JD1410:jdpatel1410@cluster0.pcsjosu.mongodb.net/farmpulse?retryWrites=true&w=majority&appName=Cluster0

NODE_ENV=production

PORT=5000

JWT_SECRET=<GENERATE_A_STRONG_RANDOM_STRING>

JWT_EXPIRE=7d

FRONTEND_URL=http://localhost:5173
```

**Important:** For `JWT_SECRET`, generate a strong random string:
- Visit: https://randomkeygen.com/
- Use a "CodeIgniter Encryption Key" (256-bit)
- Example: `k9P2mN7qR4sT6vW8xY0zA3bC5dE7fG9h`

#### 2.5 Deploy Backend

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. Watch the build logs

**Expected Output:**
```
==> Build successful! 🎉
==> Starting service...
🚀 FarmPulse API Server running on port 5000
✅ MongoDB Atlas Connected
```

#### 2.6 Get Your Backend URL

After deployment completes:
- Your backend URL will be: `https://farmpulse-backend.onrender.com`
- **Copy this URL** - you'll need it for the frontend!

#### 2.7 Test Backend

Visit: `https://farmpulse-backend.onrender.com/api/health`

Expected response:
```json
{
  "status": "ok",
  "message": "FarmPulse API is running",
  "database": "MongoDB Atlas - Cluster0",
  "timestamp": "2026-01-11T14:50:00.000Z"
}
```

✅ **Backend is now live!**

---

## Part 2: Deploy Frontend

### Step 1: Prepare Frontend for Production

#### 1.1 Create Frontend Environment File

Create `.env.production` in the root directory:

```env
VITE_API_URL=https://farmpulse-backend.onrender.com
```

**Note:** Replace with your actual backend URL from Part 1, Step 2.6

#### 1.2 Update Frontend to Use Backend API

Your frontend currently uses localStorage. For production with the backend API, you need to update `services/db.ts` to make API calls instead of using localStorage.

**Quick Fix:** We'll create an API service file.

Create `services/api.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = {
  // Auth
  register: async (username: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role: 'ADMIN' })
    });
    return res.json();
  },

  login: async (username: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return res.json();
  },

  // Add more API methods as needed...
};
```

### Step 2: Deploy Frontend on Render

#### 2.1 Create Static Site

1. Go back to Render Dashboard
2. Click **"New +"** → **"Static Site"**
3. Select your repository: **`JDPATEL-1410/farmpulse`**
4. Click **"Connect"**

#### 2.2 Configure Frontend Service

| Setting | Value |
|---------|-------|
| **Name** | `farmpulse-frontend` |
| **Branch** | `main` |
| **Root Directory** | `.` (leave empty or use `.`) |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

#### 2.3 Add Environment Variables

Click **"Advanced"** → Add environment variable:

```env
VITE_API_URL=https://farmpulse-backend.onrender.com
```

**Important:** Replace with your actual backend URL!

#### 2.4 Deploy Frontend

1. Click **"Create Static Site"**
2. Wait 3-5 minutes for build
3. Watch the build logs

**Expected Output:**
```
==> Build successful! 🎉
==> Publishing...
==> Your site is live!
```

#### 2.5 Get Your Frontend URL

After deployment:
- Your frontend URL will be: `https://farmpulse-frontend.onrender.com`
- **Copy this URL**

✅ **Frontend is now live!**

---

## Part 3: Connect Frontend & Backend

### Step 1: Update Backend CORS

1. Go to Render Dashboard
2. Click on **`farmpulse-backend`** service
3. Go to **"Environment"** tab
4. Find `FRONTEND_URL` variable
5. Update value to: `https://farmpulse-frontend.onrender.com`
6. Click **"Save Changes"**
7. Service will automatically redeploy

### Step 2: Test the Connection

1. Visit your frontend: `https://farmpulse-frontend.onrender.com`
2. Try to register a new account
3. Try to login
4. Create a farm
5. Add workers

If everything works, congratulations! 🎉

---

## 🔧 Troubleshooting

### Backend Issues

#### Build Fails
- Check build logs in Render dashboard
- Verify `package.json` has all dependencies
- Ensure build command is correct

#### MongoDB Connection Error
- Verify MongoDB URI in environment variables
- Check MongoDB Atlas Network Access (allow 0.0.0.0/0)
- Ensure database user credentials are correct

#### App Crashes
- Check runtime logs
- Verify all environment variables are set
- Look for missing dependencies

### Frontend Issues

#### Build Fails
- Check if `npm run build` works locally
- Verify all dependencies are in `package.json`
- Check for TypeScript errors

#### Can't Connect to Backend
- Verify `VITE_API_URL` is set correctly
- Check browser console for CORS errors
- Ensure backend `FRONTEND_URL` is updated

#### 404 on Page Refresh
Create `public/_redirects` file:
```
/*    /index.html   200
```

### CORS Errors

If you see CORS errors:
1. Verify `FRONTEND_URL` in backend matches your frontend URL
2. Check backend `server.js` CORS configuration
3. Restart backend service after changing environment variables

---

## 📊 Deployment Status Checklist

### Backend ✅
- [ ] Service created on Render
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Health endpoint working
- [ ] MongoDB connected

### Frontend ✅
- [ ] Static site created on Render
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Site is accessible
- [ ] Can connect to backend

### Integration ✅
- [ ] Backend CORS updated with frontend URL
- [ ] Frontend can register users
- [ ] Frontend can login
- [ ] Frontend can create/read data
- [ ] Data persists in MongoDB

---

## 🎯 Your Live URLs

After deployment, you'll have:

- **Frontend:** `https://farmpulse-frontend.onrender.com`
- **Backend API:** `https://farmpulse-backend.onrender.com`
- **API Health:** `https://farmpulse-backend.onrender.com/api/health`

---

## ⚠️ Important Notes

### Free Tier Limitations

**Render Free Tier:**
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month per service

**MongoDB Atlas Free Tier:**
- 512 MB storage
- Shared cluster
- No backups

### Security Recommendations

1. **Change MongoDB Password**
   - Current credentials are exposed
   - Create new database user with strong password
   - Update `MONGODB_URI` in Render

2. **Use Strong JWT Secret**
   - Generate a random 256-bit key
   - Never commit to Git

3. **Update CORS**
   - Only allow your frontend domain
   - Don't use wildcard (*) in production

---

## 🚀 Next Steps

1. **Custom Domain** (Optional)
   - Add custom domain in Render settings
   - Update DNS records
   - SSL is automatic

2. **Monitoring**
   - Set up uptime monitoring (UptimeRobot)
   - Configure email alerts in Render
   - Monitor MongoDB Atlas metrics

3. **Upgrades** (When needed)
   - Upgrade to paid Render plan for always-on
   - Upgrade MongoDB Atlas for backups
   - Add CDN for better performance

---

## 📚 Additional Resources

- **Render Docs:** https://render.com/docs
- **Vite Deployment:** https://vitejs.dev/guide/static-deploy.html
- **MongoDB Atlas:** https://docs.atlas.mongodb.com/

---

## 🆘 Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Review Render build/runtime logs
3. Check browser console for errors
4. Verify all environment variables
5. Review `backend/RENDER_TROUBLESHOOTING.md`

---

**Deployment Guide Version:** 1.0  
**Last Updated:** January 11, 2026  
**Status:** Ready for deployment 🚀
