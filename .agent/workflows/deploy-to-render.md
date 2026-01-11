---
description: Deploy FarmPulse Backend to Render
---

# Deploy FarmPulse Backend to Render

This workflow guides you through deploying your FarmPulse backend API to Render.

## Prerequisites

- GitHub account with the farmpulse repository
- Render account (sign up at https://render.com)
- MongoDB Atlas cluster configured

## Step 1: Prepare MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to your Cluster0 → "Network Access"
3. Click "Add IP Address"
4. Select "Allow Access from Anywhere" (0.0.0.0/0)
   - This allows Render to connect to your database
5. Click "Confirm"

## Step 2: Update Local Environment (Optional - for testing)

Update your local `.env` file in the backend directory with:

```env
MONGODB_URI=mongodb+srv://JD1410:jdpatel1410@cluster0.pcsjosu.mongodb.net/farmpulse?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
```

## Step 3: Test Locally (Optional)

// turbo
1. Navigate to backend directory:
```bash
cd backend
```

// turbo
2. Install dependencies:
```bash
npm install
```

// turbo
3. Test the connection:
```bash
npm start
```

4. Open http://localhost:5000/api/health in your browser
   - You should see: `{"status":"ok","message":"FarmPulse API is running",...}`

## Step 4: Push to GitHub

// turbo
1. Ensure all changes are committed:
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

## Step 5: Deploy to Render

### Using Render Dashboard:

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com/
   - Sign up or log in with GitHub

2. **Create New Web Service**
   - Click "New +" button
   - Select "Web Service"
   - Click "Connect a repository"
   - Authorize Render to access your GitHub
   - Select the `JDPATEL-1410/farmpulse` repository

3. **Configure the Web Service**
   Fill in these settings:
   
   - **Name:** `farmpulse-backend`
   - **Region:** Oregon (or closest to you)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. **Add Environment Variables**
   
   Click "Advanced" → Scroll to "Environment Variables"
   
   Add each of these (click "Add Environment Variable" for each):
   
   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | `mongodb+srv://JD1410:jdpatel1410@cluster0.pcsjosu.mongodb.net/farmpulse?retryWrites=true&w=majority&appName=Cluster0` |
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `JWT_SECRET` | Generate a random string (e.g., use https://randomkeygen.com/) |
   | `JWT_EXPIRE` | `7d` |
   | `FRONTEND_URL` | `http://localhost:5173` (update later with frontend URL) |

5. **Create Web Service**
   - Click "Create Web Service" button
   - Render will start building and deploying your app
   - Wait for the deployment to complete (3-5 minutes)

6. **Get Your Backend URL**
   - After deployment, you'll see a URL like: `https://farmpulse-backend.onrender.com`
   - Copy this URL - you'll need it for frontend configuration

## Step 6: Test Your Deployment

1. **Test the health endpoint:**
   - Visit: `https://farmpulse-backend.onrender.com/api/health`
   - Or use curl:
   ```bash
   curl https://farmpulse-backend.onrender.com/api/health
   ```
   
2. **Expected response:**
   ```json
   {
     "status": "ok",
     "message": "FarmPulse API is running",
     "database": "MongoDB Atlas - Cluster0",
     "timestamp": "2026-01-11T14:25:21.000Z"
   }
   ```

## Step 7: Update Frontend Configuration

Once your backend is deployed, update your frontend to use the new backend URL:

1. In your frontend `.env.local` file, update:
   ```env
   VITE_API_URL=https://farmpulse-backend.onrender.com
   ```

2. Go back to Render dashboard and update the `FRONTEND_URL` environment variable with your deployed frontend URL (after you deploy the frontend)

## Important Notes

⚠️ **Security Considerations:**

1. **Change MongoDB Password:** The current credentials are exposed. Create a new database user with a strong password:
   - Go to MongoDB Atlas → Database Access
   - Add new database user with a secure password
   - Update the MONGODB_URI in Render environment variables

2. **JWT Secret:** Always use a strong, random JWT_SECRET in production

3. **CORS:** Update FRONTEND_URL to your actual frontend domain after deployment

## Troubleshooting

### Build Fails
- Check the build logs in Render dashboard
- Verify `package.json` has all required dependencies
- Ensure Node version compatibility

### MongoDB Connection Error
- Verify MongoDB URI is correct
- Check Network Access in MongoDB Atlas (should allow 0.0.0.0/0)
- Ensure database user credentials are correct

### App Crashes After Deploy
- Check the logs in Render dashboard
- Verify all environment variables are set correctly
- Check for missing dependencies

### Free Tier Limitations
- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to paid tier for production use

## Next Steps

1. Deploy your frontend to Render or Vercel
2. Update CORS settings with actual frontend URL
3. Set up custom domain (optional)
4. Configure monitoring and alerts
5. Set up CI/CD for automatic deployments

## Useful Links

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Your Render Dashboard](https://dashboard.render.com/)
- [Your MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
