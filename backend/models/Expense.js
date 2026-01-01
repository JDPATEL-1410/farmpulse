import mongoose from 'mongoose';

// Fertilizer Expense Schema
const FertilizerExpenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    farmId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    cost: {
        type: Number,
        required: true,
        min: 0
    },
    date: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

FertilizerExpenseSchema.index({ farmId: 1, date: -1 });

// Tractor Expense Schema
const TractorExpenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    farmId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm',
        required: true
    },
    tractorName: {
        type: String,
        required: true,
        trim: true
    },
    hoursUsed: {
        type: Number,
        required: true,
        min: 0
    },
    cost: {
        type: Number,
        required: true,
        min: 0
    },
    date: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

TractorExpenseSchema.index({ farmId: 1, date: -1 });

// Other Expense Schema
const OtherExpenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    farmId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
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
    notes: {
        type: String,
        trim: true,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

OtherExpenseSchema.index({ farmId: 1, date: -1 });

export const FertilizerExpense = mongoose.model('FertilizerExpense', FertilizerExpenseSchema);
export const TractorExpense = mongoose.model('TractorExpense', TractorExpenseSchema);
export const OtherExpense = mongoose.model('OtherExpense', OtherExpenseSchema);
