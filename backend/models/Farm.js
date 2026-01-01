import mongoose from 'mongoose';

const FarmSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    areaSize: {
        type: Number,
        required: true,
        min: 0
    },
    season: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
FarmSchema.index({ userId: 1 });

export default mongoose.model('Farm', FarmSchema);
