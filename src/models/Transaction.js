import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema(
  {
    billId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill', required: true },
    method: { type: String, enum: ['cash', 'upi', 'bank', 'card', 'other'], default: 'cash' },
    screenshot: { type: String, trim: true }, // URL/path
    notes: { type: String, trim: true },
    dateTime: { type: Date, default: Date.now, required: true },
    amount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true, versionKey: false }
);

TransactionSchema.index({ billId: 1 });
TransactionSchema.index({ dateTime: 1 });

export default mongoose.model('Transaction', TransactionSchema);
