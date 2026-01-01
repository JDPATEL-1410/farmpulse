import express from 'express';
import passport from 'passport';
import Farm from '../models/Farm.js';

const router = express.Router();

// Middleware to authenticate requests
const authenticate = passport.authenticate('jwt', { session: false });

// Get all farms for logged-in user
router.get('/', authenticate, async (req, res) => {
    try {
        const farms = await Farm.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(farms);
    } catch (error) {
        console.error('Get farms error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get specific farm
router.get('/:id', authenticate, async (req, res) => {
    try {
        const farm = await Farm.findOne({ _id: req.params.id, userId: req.user._id });
        if (!farm) {
            return res.status(404).json({ message: 'Farm not found' });
        }
        res.json(farm);
    } catch (error) {
        console.error('Get farm error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create new farm
router.post('/', authenticate, async (req, res) => {
    try {
        const { name, location, areaSize, season } = req.body;

        // Validation
        if (!name || !location || !areaSize || !season) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newFarm = new Farm({
            userId: req.user._id,
            name,
            location,
            areaSize: Number(areaSize),
            season
        });

        await newFarm.save();
        res.status(201).json(newFarm);
    } catch (error) {
        console.error('Create farm error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update farm
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { name, location, areaSize, season } = req.body;

        const farm = await Farm.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { name, location, areaSize: Number(areaSize), season },
            { new: true, runValidators: true }
        );

        if (!farm) {
            return res.status(404).json({ message: 'Farm not found' });
        }

        res.json(farm);
    } catch (error) {
        console.error('Update farm error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete farm
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const farm = await Farm.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

        if (!farm) {
            return res.status(404).json({ message: 'Farm not found' });
        }

        res.json({ success: true, message: 'Farm deleted successfully' });
    } catch (error) {
        console.error('Delete farm error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
