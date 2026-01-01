import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import passportConfig from './config/passport.js';

// Import routes
import authRoutes from './routes/auth.js';
import farmRoutes from './routes/farms.js';
import workerRoutes from './routes/workers.js';
import transactionRoutes from './routes/transactions.js';
import expenseRoutes from './routes/expenses.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passportConfig.initialize());

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'FarmPulse API is running',
        database: 'MongoDB Atlas - Cluster0',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/expenses', expenseRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 FarmPulse API Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log(`\n📋 Available endpoints:`);
    console.log(`   GET  /api/health`);
    console.log(`   POST /api/auth/register`);
    console.log(`   POST /api/auth/login`);
    console.log(`   POST /api/auth/reset-password`);
    console.log(`   GET  /api/farms`);
    console.log(`   POST /api/farms`);
    console.log(`   GET  /api/workers`);
    console.log(`   POST /api/workers`);
    console.log(`   GET  /api/transactions/worker/:workerId`);
    console.log(`   POST /api/transactions`);
    console.log(`   POST /api/expenses/fertilizer`);
    console.log(`   POST /api/expenses/tractor`);
    console.log(`   POST /api/expenses/other`);
    console.log(`   GET  /api/expenses/report/:farmId`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    process.exit(0);
});
