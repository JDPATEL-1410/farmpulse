import express from 'express';
import passport from 'passport';
import { FertilizerExpense, TractorExpense, OtherExpense } from '../models/Expense.js';

const router = express.Router();

// Middleware to authenticate requests
const authenticate = passport.authenticate('jwt', { session: false });

// Add fertilizer expense
router.post('/fertilizer', authenticate, async (req, res) => {
    try {
        const { farmId, name, quantity, cost, date } = req.body;

        // Validation
        if (!farmId || !name || !quantity || !cost || !date) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newExpense = new FertilizerExpense({
            userId: req.user._id,
            farmId,
            name,
            quantity: Number(quantity),
            cost: Number(cost),
            date: new Date(date)
        });

        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        console.error('Create fertilizer expense error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add tractor expense
router.post('/tractor', authenticate, async (req, res) => {
    try {
        const { farmId, tractorName, hoursUsed, cost, date } = req.body;

        // Validation
        if (!farmId || !tractorName || !hoursUsed || !cost || !date) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newExpense = new TractorExpense({
            userId: req.user._id,
            farmId,
            tractorName,
            hoursUsed: Number(hoursUsed),
            cost: Number(cost),
            date: new Date(date)
        });

        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        console.error('Create tractor expense error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add other expense
router.post('/other', authenticate, async (req, res) => {
    try {
        const { farmId, name, amount, date, notes } = req.body;

        // Validation
        if (!farmId || !name || !amount || !date) {
            return res.status(400).json({ message: 'Farm, name, amount, and date are required' });
        }

        const newExpense = new OtherExpense({
            userId: req.user._id,
            farmId,
            name,
            amount: Number(amount),
            date: new Date(date),
            notes: notes || ''
        });

        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        console.error('Create other expense error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get farm expense report
router.get('/report/:farmId', authenticate, async (req, res) => {
    try {
        const { farmId } = req.params;
        const { startDate, endDate } = req.query;

        // Build date filter
        let dateFilter = {};
        if (startDate) dateFilter.$gte = new Date(startDate);
        if (endDate) dateFilter.$lte = new Date(endDate);

        const query = { farmId, userId: req.user._id };
        if (Object.keys(dateFilter).length > 0) {
            query.date = dateFilter;
        }

        // Get all expenses
        const fertilizers = await FertilizerExpense.find(query).sort({ date: -1 });
        const tractors = await TractorExpense.find(query).sort({ date: -1 });
        const others = await OtherExpense.find(query).sort({ date: -1 });

        // Calculate totals
        const fertilizerCost = fertilizers.reduce((sum, f) => sum + f.cost, 0);
        const tractorCost = tractors.reduce((sum, t) => sum + t.cost, 0);
        const otherExpenseCost = others.reduce((sum, o) => sum + o.amount, 0);

        res.json({
            fertilizerCost,
            tractorCost,
            otherExpenseCost,
            total: fertilizerCost + tractorCost + otherExpenseCost,
            count: fertilizers.length + tractors.length + others.length,
            records: {
                fertilizers,
                tractors,
                others
            }
        });
    } catch (error) {
        console.error('Get expense report error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
