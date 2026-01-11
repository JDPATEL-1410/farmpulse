# 🚀 FarmPulse Deployment Checklist

## ✅ Pre-Deployment Checklist

### MongoDB Atlas Setup
- [ ] MongoDB Atlas account created
- [ ] Cluster0 is running
- [ ] Database user created (JD1410)
- [ ] Network Access configured to allow all IPs (0.0.0.0/0)
- [ ] Connection string tested: `mongodb+srv://JD1410:jdpatel1410@cluster0.pcsjosu.mongodb.net/farmpulse?retryWrites=true&w=majority&appName=Cluster0`

### GitHub Repository
- [ ] Code pushed to GitHub repository: `https://github.com/JDPATEL-1410/farmpulse.git`
- [ ] All files committed (including backend folder)
- [ ] `.env` file is in `.gitignore` (not pushed to GitHub)
- [ ] `.env.example` file is included

### Local Testing
- [ ] Backend dependencies installed (`npm install` in backend folder)
- [ ] Backend runs locally (`npm start` in backend folder)
- [ ] Health endpoint works: `http://localhost:5000/api/health`
- [ ] MongoDB connection successful

## 🌐 Render Deployment Steps

### Step 1: Render Account Setup
- [ ] Render account created at https://render.com
- [ ] GitHub account connected to Render
- [ ] Repository access granted to Render

### Step 2: Create Web Service
- [ ] New Web Service created
- [ ] Repository selected: `JDPATEL-1410/farmpulse`
- [ ] Service name: `farmpulse-backend`
- [ ] Region selected (e.g., Oregon)
- [ ] Branch: `main`
- [ ] Root Directory: `backend`
- [ ] Runtime: Node
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Plan: Free (or paid)

### Step 3: Environment Variables
Add these environment variables in Render:

- [ ] `MONGODB_URI` = `mongodb+srv://JD1410:jdpatel1410@cluster0.pcsjosu.mongodb.net/farmpulse?retryWrites=true&w=majority&appName=Cluster0`
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `5000`
- [ ] `JWT_SECRET` = `<generate-strong-random-string>`
- [ ] `JWT_EXPIRE` = `7d`
- [ ] `FRONTEND_URL` = `http://localhost:5173` (update after frontend deployment)

### Step 4: Deploy
- [ ] "Create Web Service" button clicked
- [ ] Build started successfully
- [ ] Build completed without errors
- [ ] Service is live

### Step 5: Verify Deployment
- [ ] Backend URL obtained (e.g., `https://farmpulse-backend.onrender.com`)
- [ ] Health endpoint tested: `https://farmpulse-backend.onrender.com/api/health`
- [ ] Response shows: `{"status":"ok","message":"FarmPulse API is running",...}`
- [ ] MongoDB connection confirmed in logs

## 🔒 Security Checklist

### Production Security
- [ ] **CRITICAL:** Change MongoDB password (current one is exposed)
  - Go to MongoDB Atlas → Database Access
  - Create new user with strong password
  - Update MONGODB_URI in Render
- [ ] Strong JWT_SECRET generated (use https://randomkeygen.com/)
- [ ] CORS configured with actual frontend URL
- [ ] Environment variables secured in Render (not in code)

### MongoDB Atlas Security
- [ ] Network Access properly configured
- [ ] Database user has minimum required permissions
- [ ] Connection string uses strong password
- [ ] Consider IP whitelisting for additional security

## 📱 Frontend Integration

### After Backend Deployment
- [ ] Backend URL copied
- [ ] Frontend `.env.local` updated with backend URL
- [ ] Frontend tested with deployed backend
- [ ] CORS working correctly

### After Frontend Deployment
- [ ] Frontend URL obtained
- [ ] `FRONTEND_URL` environment variable updated in Render
- [ ] CORS tested from deployed frontend
- [ ] All API endpoints working

## 🐛 Troubleshooting

### If Build Fails
- [ ] Check build logs in Render dashboard
- [ ] Verify `package.json` is correct
- [ ] Ensure all dependencies are listed
- [ ] Check Node version compatibility

### If MongoDB Connection Fails
- [ ] Verify MONGODB_URI is correct
- [ ] Check Network Access in MongoDB Atlas
- [ ] Ensure 0.0.0.0/0 is whitelisted
- [ ] Verify database user credentials

### If App Crashes
- [ ] Check runtime logs in Render dashboard
- [ ] Verify all environment variables are set
- [ ] Check for missing dependencies
- [ ] Review error messages

## 📊 Post-Deployment

### Monitoring
- [ ] Render dashboard bookmarked
- [ ] MongoDB Atlas dashboard bookmarked
- [ ] Health endpoint added to monitoring
- [ ] Error logs reviewed

### Documentation
- [ ] Backend URL documented
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Team members informed

### Optional Enhancements
- [ ] Custom domain configured
- [ ] SSL certificate verified
- [ ] Auto-deploy enabled for GitHub pushes
- [ ] Upgrade to paid plan (if needed for production)
- [ ] Set up monitoring/alerting
- [ ] Configure backup strategy

## 🎉 Deployment Complete!

Your FarmPulse backend is now live at: `https://farmpulse-backend.onrender.com`

### Next Steps:
1. Deploy the frontend
2. Update CORS settings
3. Test all features end-to-end
4. Share with users!

---

## 📞 Support Resources

- **Render Documentation:** https://render.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/
- **Render Dashboard:** https://dashboard.render.com/
- **MongoDB Dashboard:** https://cloud.mongodb.com/

## 🔗 Quick Links

- **GitHub Repo:** https://github.com/JDPATEL-1410/farmpulse
- **Render Dashboard:** https://dashboard.render.com/
- **MongoDB Atlas:** https://cloud.mongodb.com/
- **Backend Health:** https://farmpulse-backend.onrender.com/api/health (after deployment)
