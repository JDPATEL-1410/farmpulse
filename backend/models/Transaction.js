import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
        required: true
    },
    type: {
        type: String,
        enum: ['LOAN', 'PAYMENT'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    date: {
        type: Date,
        required: true
    },
    remarks: {
        type: String,
        trim: true,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
TransactionSchema.index({ workerId: 1 });
TransactionSchema.index({ userId: 1 });

export default mongoose.model('WorkerTransaction', TransactionSchema);
