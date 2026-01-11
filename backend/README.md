# FarmPulse Backend API

Backend API for FarmPulse - Smart Farm Management System built with Node.js, Express, and MongoDB Atlas.

## 🚀 Features

- RESTful API with Express.js
- MongoDB Atlas database integration
- JWT authentication with Passport.js
- Worker management
- Farm management
- Transaction tracking
- Expense management (Fertilizer, Tractor, Other)
- CORS enabled for frontend integration

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb+srv://JD1410:jdpatel1410@cluster0.pcsjosu.mongodb.net/farmpulse?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
```

3. Start the development server:
```bash
npm run dev
```

## 🌐 API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/reset-password` - Reset password

### Farms
- `GET /api/farms` - Get all farms
- `POST /api/farms` - Create new farm

### Workers
- `GET /api/workers` - Get all workers
- `POST /api/workers` - Create new worker

### Transactions
- `GET /api/transactions/worker/:workerId` - Get worker transactions
- `POST /api/transactions` - Create new transaction

### Expenses
- `POST /api/expenses/fertilizer` - Add fertilizer expense
- `POST /api/expenses/tractor` - Add tractor expense
- `POST /api/expenses/other` - Add other expense
- `GET /api/expenses/report/:farmId` - Get expense report

## 🚢 Deployment on Render

### Method 1: Using Render Dashboard (Recommended)

1. **Push your code to GitHub** (if not already done)

2. **Go to [Render Dashboard](https://dashboard.render.com/)**
   - Sign up or log in

3. **Create a new Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `farmpulse` repository

4. **Configure the service:**
   - **Name:** `farmpulse-backend`
   - **Region:** Choose closest to you (e.g., Oregon)
   - **Branch:** `main` or `master`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable"
   
   Add these variables:
   ```
   MONGODB_URI=mongodb+srv://JD1410:jdpatel1410@cluster0.pcsjosu.mongodb.net/farmpulse?retryWrites=true&w=majority&appName=Cluster0
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=<generate-a-secure-random-string>
   JWT_EXPIRE=7d
   FRONTEND_URL=<your-frontend-url-after-deployment>
   ```

6. **Create Web Service**
   - Click "Create Web Service"
   - Render will automatically deploy your app

7. **Get your backend URL**
   - After deployment, you'll get a URL like: `https://farmpulse-backend.onrender.com`
   - Update the `FRONTEND_URL` environment variable later when you deploy the frontend

### Method 2: Using render.yaml (Blueprint)

1. The `render.yaml` file is already configured in your project

2. Go to Render Dashboard → "New +" → "Blueprint"

3. Connect your GitHub repository

4. Render will automatically detect the `render.yaml` file

5. Add the required environment variables (MONGODB_URI, FRONTEND_URL)

6. Deploy!

## 🔒 Security Notes

⚠️ **IMPORTANT:** For production deployment:

1. **Change your MongoDB password** - The current credentials are exposed in this README
2. **Generate a strong JWT_SECRET** - Use a random string generator
3. **Update CORS settings** - Set FRONTEND_URL to your actual frontend domain
4. **Enable MongoDB IP Whitelist** - Add Render's IP addresses or use 0.0.0.0/0 (allow all)

### MongoDB Atlas Configuration

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to your cluster → "Network Access"
3. Click "Add IP Address"
4. Select "Allow Access from Anywhere" (0.0.0.0/0) for Render deployment
5. Or add specific Render IP ranges if you prefer

## 📊 Testing the Deployment

Once deployed, test your API:

```bash
# Health check
curl https://your-app.onrender.com/api/health

# Should return:
{
  "status": "ok",
  "message": "FarmPulse API is running",
  "database": "MongoDB Atlas - Cluster0",
  "timestamp": "2026-01-11T14:25:21.000Z"
}
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB URI is correct
- Check Network Access in MongoDB Atlas (whitelist 0.0.0.0/0)
- Ensure database user has proper permissions

### Render Deployment Issues
- Check build logs in Render dashboard
- Verify all environment variables are set
- Ensure `package.json` has correct start script

### CORS Issues
- Update FRONTEND_URL environment variable
- Check CORS configuration in `server.js`

## 📝 License

ISC
