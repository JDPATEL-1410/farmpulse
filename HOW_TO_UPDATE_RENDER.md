# 🔄 How to Update Your Render Deployment

## Quick Guide: Update Backend on Render

Your backend is already deployed on Render. Here's how to update it with the latest changes:

---

## Method 1: Automatic Update (Recommended)

### If Auto-Deploy is Enabled:

Render will automatically detect new commits and redeploy!

1. **Push your changes to GitHub** (already done ✅)
2. **Go to Render Dashboard:** https://dashboard.render.com/
3. **Find your service:** `farmpulse-backend`
4. **Watch the deployment:** You'll see "Deploying..." status
5. **Wait 3-5 minutes** for the build to complete

That's it! Render will automatically:
- Pull the latest code from GitHub
- Run `npm install`
- Run `npm start`
- Deploy the new version

---

## Method 2: Manual Deploy

### If Auto-Deploy is NOT Enabled:

1. **Go to Render Dashboard:** https://dashboard.render.com/
2. **Click on your service:** `farmpulse-backend`
3. **Click "Manual Deploy"** button (top right)
4. **Select "Deploy latest commit"**
5. **Click "Deploy"**
6. **Wait for deployment** to complete

---

## ✅ Verify the Update

### Check if the update was successful:

1. **View Logs:**
   - In Render dashboard → Click "Logs" tab
   - Look for: `✅ Build successful!`
   - Look for: `🚀 FarmPulse API Server running`

2. **Test Health Endpoint:**
   ```
   https://farmpulse-backend.onrender.com/api/health
   ```
   
   Should return:
   ```json
   {
     "status": "ok",
     "message": "FarmPulse API is running",
     "database": "MongoDB Atlas - Cluster0"
   }
   ```

3. **Check Build Time:**
   - The deployment timestamp should be recent
   - Should match your latest GitHub commit time

---

## 🚀 Deploy Frontend on Render

Since you want both frontend and backend on Render, here's how to deploy the frontend:

### Step 1: Create Static Site

1. **Go to Render Dashboard**
2. **Click "New +" → "Static Site"**
3. **Connect repository:** `JDPATEL-1410/farmpulse`

### Step 2: Configure

| Setting | Value |
|---------|-------|
| **Name** | `farmpulse-frontend` |
| **Branch** | `main` |
| **Root Directory** | `.` (leave empty) |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

### Step 3: Add Environment Variable

Click "Advanced" → Add:

```
VITE_API_URL=https://farmpulse-backend.onrender.com
```

**Important:** Replace with your actual backend URL!

### Step 4: Deploy

1. Click **"Create Static Site"**
2. Wait 3-5 minutes
3. Your frontend will be live at: `https://farmpulse-frontend.onrender.com`

---

## 🔗 Connect Frontend & Backend

### After Frontend is Deployed:

1. **Go to Backend Service** in Render
2. **Click "Environment" tab**
3. **Update `FRONTEND_URL`** to your frontend URL:
   ```
   https://farmpulse-frontend.onrender.com
   ```
4. **Save Changes**
5. Backend will automatically redeploy with new CORS settings

---

## 📊 Current Status

### What's Already Done ✅

1. ✅ Backend code updated with build script
2. ✅ All deployment documentation created
3. ✅ Changes pushed to GitHub
4. ✅ Frontend environment file created
5. ✅ Redirects file for client-side routing

### What You Need to Do 🎯

1. **Backend:** Already deployed, will auto-update from GitHub
2. **Frontend:** Need to create Static Site on Render (follow steps above)
3. **Connect:** Update backend CORS with frontend URL

---

## 🎯 Your Deployment URLs

After completing the steps:

- **Backend API:** `https://farmpulse-backend.onrender.com`
- **Frontend:** `https://farmpulse-frontend.onrender.com` (after deployment)
- **GitHub:** `https://github.com/JDPATEL-1410/farmpulse`

---

## ⚡ Quick Commands

### Check Backend Status
```bash
curl https://farmpulse-backend.onrender.com/api/health
```

### View Recent Commits
```bash
git log --oneline -5
```

### Push New Changes
```bash
git add .
git commit -m "Your message"
git push origin main
```

---

## 🐛 Troubleshooting

### Backend Not Updating?

1. **Check Auto-Deploy:**
   - Render Dashboard → Your Service → Settings
   - Look for "Auto-Deploy" setting
   - Should be "Yes"

2. **Check GitHub Connection:**
   - Settings → "Connected Repository"
   - Should show: `JDPATEL-1410/farmpulse`

3. **Manual Trigger:**
   - Use "Manual Deploy" button
   - Select "Deploy latest commit"

### Build Failing?

1. **Check Logs:**
   - Click "Logs" tab
   - Look for error messages

2. **Common Issues:**
   - Missing dependencies → Check `package.json`
   - Wrong build command → Should be `npm install`
   - Environment variables missing

### Frontend Not Working?

1. **Check Build Logs**
2. **Verify Environment Variables**
3. **Test API URL:** Should match backend URL
4. **Check CORS:** Backend should allow frontend domain

---

## 📚 Full Documentation

For detailed instructions, see:
- **Complete Guide:** `RENDER_DEPLOYMENT_GUIDE.md`
- **Backend Docs:** `backend/README.md`
- **Troubleshooting:** `backend/RENDER_TROUBLESHOOTING.md`
- **Checklist:** `backend/DEPLOYMENT_CHECKLIST.md`

---

## 🎉 Success Indicators

Your deployment is successful when:

- ✅ Backend health endpoint returns "ok"
- ✅ Frontend loads without errors
- ✅ Can register/login from frontend
- ✅ Data saves to MongoDB
- ✅ No CORS errors in browser console

---

**Quick Update Guide Version:** 1.0  
**Last Updated:** January 11, 2026
