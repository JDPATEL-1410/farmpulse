# 🚀 Complete FarmPulse Deployment Guide
## From Zero to Live Web App in 30 Minutes

**Last Updated:** January 11, 2026  
**Difficulty:** Beginner-Friendly  
**Time Required:** 30 minutes

---

## 📋 What You'll Deploy

By the end of this guide, you'll have:
- ✅ **Backend API** running on Render (Node.js + Express + MongoDB)
- ✅ **Frontend Web App** running on Render (React + Vite)
- ✅ **Database** on MongoDB Atlas (Cloud Database)
- ✅ **Live URLs** accessible from anywhere in the world

---

## 🎯 Prerequisites

Before starting, make sure you have:

1. **GitHub Account** (free)
   - Your repository: `https://github.com/JDPATEL-1410/farmpulse`
   - Code already pushed ✅

2. **MongoDB Atlas Account** (free)
   - Cluster0 already created ✅
   - Connection string ready ✅

3. **Render Account** (free)
   - Sign up at: https://render.com
   - We'll do this in Step 1

---

## 📚 Table of Contents

1. [Setup Render Account](#step-1-setup-render-account)
2. [Configure MongoDB Atlas](#step-2-configure-mongodb-atlas)
3. [Deploy Backend API](#step-3-deploy-backend-api)
4. [Deploy Frontend](#step-4-deploy-frontend)
5. [Connect Frontend & Backend](#step-5-connect-frontend--backend)
6. [Test Your App](#step-6-test-your-app)
7. [Troubleshooting](#troubleshooting)

---

## Step 1: Setup Render Account

### 1.1 Create Render Account

1. **Go to:** https://render.com
2. **Click:** "Get Started" or "Sign Up"
3. **Choose:** "Sign in with GitHub"
4. **Authorize:** Click "Authorize Render" when prompted
5. **Complete:** Fill in any required details

✅ **You now have a Render account!**

---

## Step 2: Configure MongoDB Atlas

### 2.1 Allow Render to Access Your Database

1. **Go to:** https://cloud.mongodb.com/
2. **Login** to your account
3. **Click:** "Network Access" (left sidebar)
4. **Click:** "Add IP Address" button
5. **Select:** "Allow Access from Anywhere"
6. **Confirm:** Click "Confirm"

**Why?** This allows Render's servers to connect to your MongoDB database.

✅ **MongoDB is now accessible from Render!**

---

## Step 3: Deploy Backend API

### 3.1 Create Backend Web Service

1. **Go to:** https://dashboard.render.com/
2. **Click:** "New +" button (top right)
3. **Select:** "Web Service"
4. **Click:** "Connect a repository"
5. **Find:** `JDPATEL-1410/farmpulse`
6. **Click:** "Connect"

### 3.2 Configure Backend Settings

Fill in these exact values:

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

### 3.3 Add Environment Variables

**Click "Advanced"** → Scroll to "Environment Variables"

Add these 6 variables (click "Add Environment Variable" for each):

#### Variable 1: MONGODB_URI
```
Key: MONGODB_URI
Value: mongodb+srv://JD1410:jdpatel1410@cluster0.pcsjosu.mongodb.net/farmpulse?retryWrites=true&w=majority&appName=Cluster0
```

#### Variable 2: NODE_ENV
```
Key: NODE_ENV
Value: production
```

#### Variable 3: PORT
```
Key: PORT
Value: 5000
```

#### Variable 4: JWT_SECRET
```
Key: JWT_SECRET
Value: <GENERATE A RANDOM STRING>
```

**How to generate JWT_SECRET:**
1. Go to: https://randomkeygen.com/
2. Copy any "CodeIgniter Encryption Key" (256-bit)
3. Example: `k9P2mN7qR4sT6vW8xY0zA3bC5dE7fG9h`

#### Variable 5: JWT_EXPIRE
```
Key: JWT_EXPIRE
Value: 7d
```

#### Variable 6: FRONTEND_URL
```
Key: FRONTEND_URL
Value: http://localhost:5173
```

**Note:** We'll update this later with your actual frontend URL.

### 3.4 Deploy Backend

1. **Click:** "Create Web Service"
2. **Wait:** 3-5 minutes for deployment
3. **Watch:** Build logs (should see green checkmarks)

**Expected Output:**
```
✓ Build successful! 🎉
🚀 FarmPulse API Server running on port 5000
✅ MongoDB Atlas Connected: cluster0.pcsjosu.mongodb.net
📊 Database: farmpulse
```

### 3.5 Get Your Backend URL

After deployment completes:
- **Your URL:** `https://farmpulse-backend.onrender.com`
- **Copy this URL** - you'll need it!

### 3.6 Test Backend

**Open in browser:** `https://farmpulse-backend.onrender.com/api/health`

**Expected Response:**
```json
{
  "status": "ok",
  "message": "FarmPulse API is running",
  "database": "MongoDB Atlas - Cluster0",
  "timestamp": "2026-01-11T15:15:00.000Z"
}
```

✅ **Backend is live and working!**

---

## Step 4: Deploy Frontend

### 4.1 Create Frontend Static Site

**IMPORTANT:** Frontend must be a **Static Site**, NOT a Web Service!

1. **Go to:** https://dashboard.render.com/
2. **Click:** "New +" button
3. **Select:** "Static Site" ⭐ (NOT Web Service!)
4. **Find:** `JDPATEL-1410/farmpulse`
5. **Click:** "Connect"

### 4.2 Configure Frontend Settings

Fill in these exact values:

| Setting | Value |
|---------|-------|
| **Name** | `farmpulse-frontend` |
| **Branch** | `main` |
| **Root Directory** | (leave empty or use `.`) |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

### 4.3 Add Environment Variable

**Click "Advanced"** → Add environment variable:

```
Key: VITE_API_URL
Value: https://farmpulse-backend.onrender.com
```

**IMPORTANT:** Replace with your actual backend URL from Step 3.5!

### 4.4 Deploy Frontend

1. **Click:** "Create Static Site"
2. **Wait:** 3-5 minutes for build
3. **Watch:** Build logs

**Expected Output:**
```
✓ 981 modules transformed
✓ built in 7.05s
✓ Build successful! 🎉
==> Your site is live!
```

### 4.5 Get Your Frontend URL

After deployment:
- **Your URL:** `https://farmpulse-frontend.onrender.com`
- **Copy this URL**

✅ **Frontend is live!**

---

## Step 5: Connect Frontend & Backend

### 5.1 Update Backend CORS

Now we need to tell the backend to accept requests from the frontend.

1. **Go to:** https://dashboard.render.com/
2. **Click:** `farmpulse-backend` service
3. **Click:** "Environment" tab (left sidebar)
4. **Find:** `FRONTEND_URL` variable
5. **Click:** Edit icon (pencil)
6. **Update value to:** `https://farmpulse-frontend.onrender.com`
7. **Click:** "Save Changes"

**What happens:** Backend will automatically redeploy with new CORS settings (takes 2-3 minutes).

✅ **Frontend and Backend are now connected!**

---

## Step 6: Test Your App

### 6.1 Open Your Frontend

**Visit:** `https://farmpulse-frontend.onrender.com`

### 6.2 Test Registration

1. **Click:** "Register" or "Sign Up"
2. **Enter:**
   - Username: `testuser`
   - Password: `test123`
3. **Click:** "Register"
4. **Expected:** You should be logged in and see the dashboard

### 6.3 Test Farm Creation

1. **Click:** "Add Farm" or "Create Farm"
2. **Fill in:**
   - Farm Name: `Test Farm`
   - Location: `Test Location`
   - Area Size: `10`
3. **Click:** "Save"
4. **Expected:** Farm should appear in the list

### 6.4 Verify in MongoDB

1. **Go to:** https://cloud.mongodb.com/
2. **Click:** "Browse Collections"
3. **Select:** `farmpulse` database
4. **Check:** You should see your data in collections

✅ **Everything is working!**

---

## 🎉 Congratulations!

Your FarmPulse app is now **LIVE** and accessible from anywhere!

### Your Live URLs:

- **Frontend:** `https://farmpulse-frontend.onrender.com`
- **Backend API:** `https://farmpulse-backend.onrender.com`
- **API Health:** `https://farmpulse-backend.onrender.com/api/health`

### What You've Accomplished:

✅ Deployed a full-stack web application  
✅ Connected to a cloud database (MongoDB Atlas)  
✅ Set up proper CORS and security  
✅ Made your app accessible worldwide  

---

## 📊 Deployment Summary

```
┌─────────────────────────────────────────┐
│         Your Architecture               │
├─────────────────────────────────────────┤
│                                         │
│  User Browser                           │
│       ↓                                 │
│  Frontend (Render Static Site)          │
│       ↓                                 │
│  Backend API (Render Web Service)       │
│       ↓                                 │
│  MongoDB Atlas (Cloud Database)         │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔄 How to Update Your App

### When You Make Code Changes:

1. **Commit changes:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **Render auto-deploys:**
   - Both frontend and backend will automatically update
   - Wait 3-5 minutes
   - Changes are live!

---

## ⚠️ Important Notes

### Free Tier Limitations

**Render Free Tier:**
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- This is normal behavior

**MongoDB Atlas Free Tier:**
- 512 MB storage
- Shared cluster
- Perfect for development and small apps

### Security Recommendations

1. **Change MongoDB Password**
   - Current credentials are exposed in this guide
   - Go to MongoDB Atlas → Database Access
   - Create new user with strong password
   - Update `MONGODB_URI` in Render

2. **Use Strong JWT Secret**
   - The one you generated is good
   - Never commit it to Git
   - Keep it in Render environment variables only

---

## 🐛 Troubleshooting

### Backend Issues

#### Problem: "Build failed"
**Solution:**
- Check build logs in Render dashboard
- Verify all environment variables are set
- Ensure `backend/package.json` exists

#### Problem: "MongoDB connection failed"
**Solution:**
- Verify MongoDB Network Access allows 0.0.0.0/0
- Check `MONGODB_URI` is correct
- Ensure database user has permissions

#### Problem: "App crashes after deploy"
**Solution:**
- Check runtime logs in Render
- Verify all 6 environment variables are set
- Look for missing dependencies

### Frontend Issues

#### Problem: "Build failed"
**Solution:**
- Check if `npm run build` works locally
- Verify `package.json` has all dependencies
- Check for TypeScript errors

#### Problem: "Can't connect to backend"
**Solution:**
- Verify `VITE_API_URL` matches backend URL
- Check browser console for errors
- Ensure backend `FRONTEND_URL` is updated

#### Problem: "404 on page refresh"
**Solution:**
- Verify `public/_redirects` file exists
- Should contain: `/*    /index.html   200`

### CORS Errors

#### Problem: "CORS policy blocked"
**Solution:**
1. Check backend `FRONTEND_URL` matches your frontend URL exactly
2. Ensure backend has redeployed after changing environment variable
3. Clear browser cache and try again

### Common Mistakes

❌ **Deploying frontend as Web Service** → Use Static Site instead  
❌ **Forgetting to update FRONTEND_URL** → Backend won't allow frontend requests  
❌ **Wrong MongoDB URI** → Check for typos  
❌ **Not waiting for redeploy** → Changes take 2-3 minutes  

---

## 📱 Testing Checklist

Use this checklist to verify everything works:

### Backend ✅
- [ ] Service shows "Live" status in Render
- [ ] Health endpoint returns `{"status": "ok"}`
- [ ] MongoDB connection successful (check logs)
- [ ] No errors in runtime logs

### Frontend ✅
- [ ] Site loads without errors
- [ ] Can see login/register page
- [ ] No console errors in browser
- [ ] Assets load correctly

### Integration ✅
- [ ] Can register new user
- [ ] Can login
- [ ] Can create farm
- [ ] Can add workers
- [ ] Data appears in MongoDB
- [ ] No CORS errors

---

## 🚀 Next Steps

### Optional Enhancements

1. **Custom Domain**
   - Buy a domain (e.g., farmpulse.com)
   - Add to Render settings
   - Update DNS records
   - SSL is automatic!

2. **Monitoring**
   - Set up UptimeRobot (free)
   - Monitor your API endpoint
   - Get email alerts if down

3. **Upgrades**
   - Upgrade Render to paid plan ($7/month) for always-on
   - Upgrade MongoDB Atlas for backups
   - Add CDN for faster loading

---

## 📚 Additional Resources

- **Render Documentation:** https://render.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/
- **Vite Deployment:** https://vitejs.dev/guide/static-deploy.html
- **Your GitHub Repo:** https://github.com/JDPATEL-1410/farmpulse

---

## 🆘 Need Help?

If you're stuck:

1. **Check the troubleshooting section** above
2. **Review Render logs** (build and runtime)
3. **Check browser console** for frontend errors
4. **Verify all environment variables** are set correctly
5. **Read:** `backend/RENDER_TROUBLESHOOTING.md` in your project

---

## 📝 Quick Reference

### Backend Configuration
```
Type: Web Service
Root Directory: backend
Build: npm install
Start: npm start
Environment Variables: 6 total
```

### Frontend Configuration
```
Type: Static Site
Root Directory: . (empty)
Build: npm install && npm run build
Publish: dist
Environment Variables: 1 (VITE_API_URL)
```

### MongoDB Configuration
```
Network Access: 0.0.0.0/0 (Allow all)
Database: farmpulse
Connection: Via MONGODB_URI
```

---

## 🎯 Final Checklist

Before you finish, verify:

- [ ] Backend is live and health check works
- [ ] Frontend is live and loads correctly
- [ ] Can register and login
- [ ] Can create and view data
- [ ] Data persists in MongoDB
- [ ] No CORS errors
- [ ] Both services show "Live" in Render dashboard

---

**🎉 You did it! Your FarmPulse app is now live on the internet!**

Share your app:
- **Frontend:** `https://farmpulse-frontend.onrender.com`
- **API:** `https://farmpulse-backend.onrender.com/api/health`

---

**Guide Version:** 1.0  
**Created:** January 11, 2026  
**Tested:** ✅ Working  
**Difficulty:** Beginner-Friendly  
**Time:** 30 minutes
