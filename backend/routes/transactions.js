import express from 'express';
import passport from 'passport';
import WorkerTransaction from '../models/Transaction.js';

const router = express.Router();

// Middleware to authenticate requests
const authenticate = passport.authenticate('jwt', { session: false });

// Get all transactions for a specific worker
router.get('/worker/:workerId', authenticate, async (req, res) => {
    try {
        const transactions = await WorkerTransaction.find({
            workerId: req.params.workerId,
            userId: req.user._id
        }).sort({ date: -1 });

        res.json(transactions);
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get worker balance
router.get('/worker/:workerId/balance', authenticate, async (req, res) => {
    try {
        const transactions = await WorkerTransaction.find({
            workerId: req.params.workerId,
            userId: req.user._id
        });

        const balance = transactions.reduce((acc, tx) => {
            return tx.type === 'LOAN' ? acc + tx.amount : acc - tx.amount;
        }, 0);

        res.json({ balance });
    } catch (error) {
        console.error('Get balance error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add new transaction
router.post('/', authenticate, async (req, res) => {
    try {
        const { workerId, type, amount, date, remarks } = req.body;

        // Validation
        if (!workerId || !type || !amount || !date) {
            return res.status(400).json({ message: 'Worker, type, amount, and date are required' });
        }

        if (!['LOAN', 'PAYMENT'].includes(type)) {
            return res.status(400).json({ message: 'Type must be LOAN or PAYMENT' });
        }

        const newTransaction = new WorkerTransaction({
            userId: req.user._id,
            workerId,
            type,
            amount: Number(amount),
            date: new Date(date),
            remarks: remarks || ''
        });

        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        console.error('Create transaction error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
