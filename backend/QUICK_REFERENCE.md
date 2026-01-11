# 📋 FarmPulse Backend - Quick Reference

## 🔗 Important URLs

### Development
- **Local API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health

### Production (After Deployment)
- **Render Dashboard:** https://dashboard.render.com/
- **Backend URL:** https://farmpulse-backend.onrender.com
- **Health Check:** https://farmpulse-backend.onrender.com/api/health

### Database
- **MongoDB Atlas:** https://cloud.mongodb.com/
- **Cluster:** Cluster0
- **Database Name:** farmpulse

## 🔑 Environment Variables

```env
MONGODB_URI=mongodb+srv://JD1410:jdpatel1410@cluster0.pcsjosu.mongodb.net/farmpulse?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production
PORT=5000
JWT_SECRET=<your-secret-key>
JWT_EXPIRE=7d
FRONTEND_URL=<your-frontend-url>
```

## 🚀 Quick Commands

### Local Development
```bash
# Install dependencies
cd backend
npm install

# Start development server
npm run dev

# Start production server
npm start
```

### Windows Users
```bash
# Install dependencies
.\backend\install.bat

# Start server
.\backend\start.bat
```

## 📡 API Endpoints

### Authentication
```
POST /api/auth/register    - Register new user
POST /api/auth/login       - Login user
POST /api/auth/reset-password - Reset password
```

### Farms
```
GET  /api/farms            - Get all farms
POST /api/farms            - Create new farm
```

### Workers
```
GET  /api/workers          - Get all workers
POST /api/workers          - Create new worker
```

### Transactions
```
GET  /api/transactions/worker/:workerId - Get worker transactions
POST /api/transactions     - Create new transaction
```

### Expenses
```
POST /api/expenses/fertilizer - Add fertilizer expense
POST /api/expenses/tractor    - Add tractor expense
POST /api/expenses/other      - Add other expense
GET  /api/expenses/report/:farmId - Get expense report
```

## 🛠️ Deployment Steps (Summary)

1. **MongoDB Atlas**
   - Enable Network Access (0.0.0.0/0)

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

3. **Render Setup**
   - Create Web Service
   - Connect GitHub repo
   - Set Root Directory: `backend`
   - Add environment variables

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete

5. **Test**
   - Visit health endpoint
   - Verify MongoDB connection

## 🐛 Common Issues & Fixes

### MongoDB Connection Error
```
✗ Fix: Check Network Access in MongoDB Atlas
✗ Ensure 0.0.0.0/0 is whitelisted
✗ Verify connection string is correct
```

### Build Fails on Render
```
✗ Check build logs
✗ Verify package.json is correct
✗ Ensure all dependencies are listed
```

### CORS Error
```
✗ Update FRONTEND_URL in environment variables
✗ Restart the Render service
```

### App Spins Down (Free Tier)
```
✗ This is normal for Render free tier
✗ First request after 15min may take 30-60s
✗ Consider upgrading for production
```

## 🔒 Security Reminders

⚠️ **IMPORTANT:**
1. Change MongoDB password before production
2. Use strong JWT_SECRET
3. Update FRONTEND_URL with actual domain
4. Never commit .env file to GitHub

## 📞 Support

- **Render Docs:** https://render.com/docs
- **MongoDB Docs:** https://docs.atlas.mongodb.com/
- **Express Docs:** https://expressjs.com/

## 📝 Files Reference

- `server.js` - Main application file
- `config/database.js` - MongoDB connection
- `config/passport.js` - Authentication config
- `models/` - Database models
- `routes/` - API routes
- `.env` - Environment variables (local only)
- `.env.example` - Environment template

---

**Last Updated:** January 11, 2026
**Version:** 1.0.0
