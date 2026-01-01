# Hosting Guide for FarmPulse

Complete guide to deploy your FarmPulse application with MongoDB Atlas backend.

## Architecture Overview

```mermaid
graph LR
    A[User Browser] --> B[Frontend - Vercel/Netlify]
    B --> C[Backend API - Render/Railway]
    C --> D[MongoDB Atlas]
```

**Components:**
- **Frontend**: React + Vite application (static files)
- **Backend**: Node.js + Express API server
- **Database**: MongoDB Atlas (already set up)

---

## Prerequisites

Before hosting, ensure you have:

- ✅ MongoDB Atlas cluster set up (Cluster0)
- ✅ MongoDB Compass connected and database created
- ✅ Backend code implemented
- ✅ Frontend updated to use API
- ✅ Git repository (GitHub, GitLab, or Bitbucket)

---

## Part 1: Backend Hosting

### Option A: Render (Recommended for Beginners)

**Why Render?**
- Free tier available
- Automatic deployments from Git
- Easy environment variable management
- Good documentation

#### Step-by-Step Deployment

**1. Prepare Your Backend**

Create `backend/package.json` if not exists:
```json
{
  "name": "farmpulse-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express-validator": "^7.0.1"
  }
}
```

**2. Create Render Account**

1. Go to [render.com](https://render.com)
2. Sign up with GitHub/GitLab
3. Authorize Render to access your repositories

**3. Create New Web Service**

1. Click "New +" → "Web Service"
2. Connect your repository
3. Configure:
   - **Name**: `farmpulse-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main` or `master`
   - **Root Directory**: `backend` (if backend is in subfolder)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

**4. Add Environment Variables**

In Render dashboard, go to "Environment" tab and add:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://JD1410:jdpatel1410@cluster0.pcsjosu.mongodb.net/FarmPulse?appName=Cluster0` |
| `JWT_SECRET` | `your_secure_random_secret_change_this_in_production` |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |

**5. Deploy**

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your backend URL will be: `https://farmpulse-backend.onrender.com`

**6. Test Backend**

Open in browser or use curl:
```bash
curl https://farmpulse-backend.onrender.com/api/health
```

Should return: `{"status": "ok"}`

---

### Option B: Railway

**Why Railway?**
- Very simple deployment
- Good free tier ($5 credit/month)
- Fast deployments

#### Deployment Steps

**1. Create Railway Account**

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Authorize Railway

**2. Create New Project**

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Railway auto-detects Node.js

**3. Configure**

1. Add environment variables:
   - Click on your service
   - Go to "Variables" tab
   - Add the same variables as Render

**4. Deploy**

- Railway automatically deploys
- Your URL: `https://farmpulse-backend.up.railway.app`

---

### Option C: Heroku

**Why Heroku?**
- Popular and well-documented
- Easy MongoDB Atlas integration
- Many add-ons available

#### Deployment Steps

**1. Install Heroku CLI**

Download from [heroku.com/cli](https://devcenter.heroku.com/articles/heroku-cli)

**2. Login and Create App**

```bash
heroku login
cd backend
heroku create farmpulse-backend
```

**3. Set Environment Variables**

```bash
heroku config:set MONGODB_URI="mongodb+srv://JD1410:jdpatel1410@cluster0.pcsjosu.mongodb.net/FarmPulse?appName=Cluster0"
heroku config:set JWT_SECRET="your_secure_secret"
heroku config:set NODE_ENV="production"
```

**4. Deploy**

```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

**5. Open App**

```bash
heroku open
```

Your URL: `https://farmpulse-backend.herokuapp.com`

---

## Part 2: Frontend Hosting

### Option A: Vercel (Recommended)

**Why Vercel?**
- Optimized for React/Vite
- Free tier with generous limits
- Automatic deployments
- Built-in CDN

#### Deployment Steps

**1. Prepare Frontend**

Update `vite.config.ts` to set API URL:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_API_URL': JSON.stringify(
      process.env.VITE_API_URL || 'http://localhost:5000'
    )
  }
})
```

Update `services/db.ts` to use environment variable:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

**2. Create Vercel Account**

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel

**3. Import Project**

1. Click "Add New..." → "Project"
2. Import your Git repository
3. Vercel auto-detects Vite

**4. Configure**

- **Framework Preset**: Vite
- **Root Directory**: `./` (or where your frontend is)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

**5. Add Environment Variable**

In project settings:
- Key: `VITE_API_URL`
- Value: `https://farmpulse-backend.onrender.com` (your backend URL)

**6. Deploy**

1. Click "Deploy"
2. Wait 2-3 minutes
3. Your URL: `https://farmpulse.vercel.app`

---

### Option B: Netlify

**Why Netlify?**
- Great for static sites
- Easy drag-and-drop deployment
- Free SSL certificates

#### Deployment Steps

**1. Build Frontend Locally**

```bash
npm run build
```

This creates a `dist` folder.

**2. Create Netlify Account**

1. Go to [netlify.com](https://netlify.com)
2. Sign up

**3. Deploy**

**Method 1: Drag and Drop**
1. Drag the `dist` folder to Netlify
2. Site is live instantly

**Method 2: Git Integration**
1. Click "New site from Git"
2. Connect repository
3. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Add environment variable: `VITE_API_URL`
5. Deploy

Your URL: `https://farmpulse.netlify.app`

---

### Option C: GitHub Pages

**Why GitHub Pages?**
- Free hosting
- Good for simple deployments
- Integrated with GitHub

#### Deployment Steps

**1. Install gh-pages**

```bash
npm install --save-dev gh-pages
```

**2. Update package.json**

Add:
```json
{
  "homepage": "https://yourusername.github.io/farmpulse",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

**3. Update vite.config.ts**

```typescript
export default defineConfig({
  base: '/farmpulse/',
  // ... rest of config
})
```

**4. Deploy**

```bash
npm run deploy
```

Your URL: `https://yourusername.github.io/farmpulse`

---

## Part 3: MongoDB Atlas Configuration

### Allow Backend to Connect

**1. Whitelist IP Addresses**

1. Login to [MongoDB Atlas](https://cloud.mongodb.com)
2. Go to "Network Access"
3. Click "Add IP Address"
4. Choose "Allow Access from Anywhere" (`0.0.0.0/0`)
5. Click "Confirm"

> [!WARNING]
> For production, you should whitelist only your backend server's IP address for better security.

**2. Verify Connection String**

Ensure your connection string includes the database name:
```
mongodb+srv://JD1410:jdpatel1410@cluster0.pcsjosu.mongodb.net/FarmPulse?appName=Cluster0
```

---

## Part 4: Testing Your Deployment

### Test Backend

**1. Health Check**
```bash
curl https://your-backend-url.com/api/health
```

**2. Register User**
```bash
curl -X POST https://your-backend-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123","role":"ADMIN"}'
```

**3. Login**
```bash
curl -X POST https://your-backend-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

Should return JWT token.

### Test Frontend

1. Open your frontend URL in browser
2. Register a new account
3. Login
4. Create a farm
5. Add workers
6. Record transactions
7. Check MongoDB Compass to verify data is saved

---

## Part 5: Custom Domain (Optional)

### For Vercel

1. Go to project settings
2. Click "Domains"
3. Add your domain (e.g., `farmpulse.com`)
4. Update DNS records as instructed
5. SSL certificate is automatic

### For Netlify

1. Go to "Domain settings"
2. Add custom domain
3. Update DNS records
4. SSL certificate is automatic

### For Backend (Render)

1. Go to service settings
2. Click "Custom Domains"
3. Add domain (e.g., `api.farmpulse.com`)
4. Update DNS records
5. SSL certificate is automatic

---

## Part 6: Monitoring and Maintenance

### Backend Monitoring

**Render:**
- View logs in dashboard
- Set up email alerts for crashes
- Monitor resource usage

**Railway:**
- Real-time logs
- Metrics dashboard
- Usage tracking

### Frontend Monitoring

**Vercel:**
- Analytics dashboard
- Performance metrics
- Error tracking

**Netlify:**
- Analytics
- Form submissions
- Function logs

### Database Monitoring

**MongoDB Atlas:**
1. Login to Atlas dashboard
2. Go to "Metrics"
3. Monitor:
   - Connections
   - Operations per second
   - Storage usage
   - Network traffic

---

## Troubleshooting

### CORS Errors

**Problem:** Frontend can't connect to backend

**Solution:** Ensure backend has CORS configured:

```javascript
// backend/server.js
import cors from 'cors';

app.use(cors({
  origin: 'https://your-frontend-url.vercel.app',
  credentials: true
}));
```

### Environment Variables Not Working

**Problem:** API URL is undefined

**Solution:**
- Ensure variable name starts with `VITE_` for Vite
- Rebuild frontend after adding variables
- Check variable is set in hosting platform

### Database Connection Failed

**Problem:** Backend can't connect to MongoDB

**Solution:**
- Check MongoDB Atlas IP whitelist
- Verify connection string is correct
- Check username and password
- Ensure database name is in connection string

### 404 Errors on Refresh

**Problem:** Frontend routes return 404 when refreshed

**Solution:**

**For Vercel:** Create `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**For Netlify:** Create `public/_redirects`:
```
/*    /index.html   200
```

---

## Cost Breakdown

### Free Tier Limits

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **MongoDB Atlas** | 512 MB storage | Shared cluster, 3 nodes |
| **Render** | 750 hours/month | Sleeps after 15 min inactivity |
| **Railway** | $5 credit/month | ~500 hours |
| **Vercel** | 100 GB bandwidth | Unlimited projects |
| **Netlify** | 100 GB bandwidth | 300 build minutes |

### Scaling Costs

When you outgrow free tier:

- **MongoDB Atlas**: $9/month (M10 cluster)
- **Render**: $7/month (always-on)
- **Railway**: $5/month (500 hours)
- **Vercel Pro**: $20/month
- **Netlify Pro**: $19/month

---

## Security Best Practices

### 1. Environment Variables

- ✅ Never commit `.env` files
- ✅ Use different secrets for dev/production
- ✅ Rotate JWT secrets periodically

### 2. MongoDB Security

- ✅ Use strong passwords
- ✅ Enable IP whitelisting
- ✅ Use database-specific users
- ✅ Enable audit logs (paid tier)

### 3. API Security

- ✅ Implement rate limiting
- ✅ Validate all inputs
- ✅ Use HTTPS only
- ✅ Set secure CORS policies

### 4. Frontend Security

- ✅ Don't store sensitive data in localStorage
- ✅ Implement JWT expiration
- ✅ Use HTTPS
- ✅ Sanitize user inputs

---

## Next Steps After Deployment

1. ✅ **Test thoroughly** - Test all features in production
2. ✅ **Monitor performance** - Check logs and metrics
3. ✅ **Set up backups** - MongoDB Atlas automatic backups
4. ✅ **Add analytics** - Google Analytics or similar
5. ✅ **Implement CI/CD** - Automatic deployments on git push
6. ✅ **Add error tracking** - Sentry or similar
7. ✅ **Performance optimization** - Lighthouse audit
8. ✅ **SEO optimization** - Meta tags, sitemap

---

## Support Resources

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **MongoDB Atlas**: [mongodb.com/docs/atlas](https://www.mongodb.com/docs/atlas/)
- **Express.js**: [expressjs.com](https://expressjs.com/)
- **React**: [react.dev](https://react.dev/)

---

## Quick Reference Commands

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Frontend Development
```bash
npm install
npm run dev
```

### Build Frontend
```bash
npm run build
```

### Test Production Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
vercel --prod
```

### View Logs (Render)
```bash
# In Render dashboard → Logs tab
```

---

## Conclusion

You now have a complete guide to:
- ✅ Set up MongoDB Atlas database
- ✅ Deploy backend API
- ✅ Deploy frontend application
- ✅ Configure custom domains
- ✅ Monitor and maintain your application

Your FarmPulse application is now live and accessible worldwide! 🚀
