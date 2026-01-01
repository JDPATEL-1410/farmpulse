import express from 'express';
import passport from 'passport';
import Worker from '../models/Worker.js';

const router = express.Router();

// Middleware to authenticate requests
const authenticate = passport.authenticate('jwt', { session: false });

// Get all workers (optionally filter by farmId)
router.get('/', authenticate, async (req, res) => {
    try {
        const { farmId } = req.query;

        let query = { userId: req.user._id };
        if (farmId && farmId !== 'ALL') {
            query.farmId = farmId;
        }

        const workers = await Worker.find(query)
            .populate('farmId', 'name')
            .sort({ createdAt: -1 });

        res.json(workers);
    } catch (error) {
        console.error('Get workers error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get specific worker
router.get('/:id', authenticate, async (req, res) => {
    try {
        const worker = await Worker.findOne({ _id: req.params.id, userId: req.user._id })
            .populate('farmId', 'name');

        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }

        res.json(worker);
    } catch (error) {
        console.error('Get worker error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add new worker
router.post('/', authenticate, async (req, res) => {
    try {
        const { name, mobile, farmId, joiningDate } = req.body;

        // Validation
        if (!name || !mobile || !farmId || !joiningDate) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newWorker = new Worker({
            userId: req.user._id,
            farmId,
            name,
            mobile,
            joiningDate: new Date(joiningDate)
        });

        await newWorker.save();
        await newWorker.populate('farmId', 'name');

        res.status(201).json(newWorker);
    } catch (error) {
        console.error('Create worker error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update worker
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { name, mobile, farmId, joiningDate } = req.body;

        const worker = await Worker.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { name, mobile, farmId, joiningDate: new Date(joiningDate) },
            { new: true, runValidators: true }
        ).populate('farmId', 'name');

        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }

        res.json(worker);
    } catch (error) {
        console.error('Update worker error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete worker
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const worker = await Worker.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }

        res.json({ success: true, message: 'Worker deleted successfully' });
    } catch (error) {
        console.error('Delete worker error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
