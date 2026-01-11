# 🔧 URGENT FIX: Frontend Deployment Error

## ❌ Problem

You deployed the frontend as a **Web Service** but it should be a **Static Site**.

**Error:**
```
npm error Missing script: "start"
```

**Why:** The frontend is a static React/Vite app. It doesn't need a server to run - it just needs to be built and served as static files.

---

## ✅ Solution: Delete and Recreate as Static Site

### Step 1: Delete the Wrong Service

1. Go to **Render Dashboard:** https://dashboard.render.com/
2. Find your frontend service (probably named `farmpulse` or `farmpulse-frontend`)
3. Click on it
4. Go to **Settings** (bottom of left sidebar)
5. Scroll to bottom → Click **"Delete Web Service"**
6. Confirm deletion

### Step 2: Create Static Site (Correct Way)

1. Click **"New +"** button
2. Select **"Static Site"** (NOT "Web Service"!)
3. Connect repository: `JDPATEL-1410/farmpulse`

### Step 3: Configure Static Site

| Setting | Value |
|---------|-------|
| **Name** | `farmpulse-frontend` |
| **Branch** | `main` |
| **Root Directory** | (leave empty or use `.`) |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

### Step 4: Add Environment Variable

Click **"Advanced"** → Add environment variable:

```
VITE_API_URL=https://farmpulse-backend.onrender.com
```

**Important:** Replace with your actual backend URL!

### Step 5: Deploy

1. Click **"Create Static Site"**
2. Wait 3-5 minutes
3. ✅ Success!

---

## 📊 Key Differences

### Web Service (Backend) ❌ for Frontend
- Runs a Node.js server
- Needs `npm start` command
- Stays running continuously
- **Use for:** Express/Node.js backends

### Static Site (Frontend) ✅ for Frontend
- Builds once, serves static files
- No server needed
- Just HTML/CSS/JS files
- **Use for:** React/Vue/Vite apps

---

## 🎯 Your Correct Setup

### Backend (Web Service) ✅
- **Type:** Web Service
- **Name:** `farmpulse-backend`
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **URL:** `https://farmpulse-backend.onrender.com`

### Frontend (Static Site) ✅
- **Type:** Static Site
- **Name:** `farmpulse-frontend`
- **Root Directory:** `.` (empty)
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **URL:** `https://farmpulse-frontend.onrender.com`

---

## ✅ After Frontend Deploys Successfully

### Update Backend CORS:

1. Go to **`farmpulse-backend`** service
2. Click **"Environment"** tab
3. Find `FRONTEND_URL` variable
4. Update to: `https://farmpulse-frontend.onrender.com`
5. Save → Backend will auto-redeploy

---

## 🎉 Success Indicators

Your deployment is correct when:

- ✅ Frontend shows as "Static Site" (not "Web Service")
- ✅ Build completes successfully
- ✅ Site is accessible
- ✅ No "Missing script: start" error

---

## 📞 Quick Reference

### Backend (Already Working)
```
Type: Web Service
URL: https://farmpulse-backend.onrender.com/api/health
Status: ✅ Should return {"status": "ok"}
```

### Frontend (Need to Fix)
```
Type: Static Site (NOT Web Service!)
Build: npm install && npm run build
Publish: dist
```

---

**Fix Guide Version:** 1.0  
**Issue:** Frontend deployed as Web Service instead of Static Site  
**Solution:** Delete and recreate as Static Site
