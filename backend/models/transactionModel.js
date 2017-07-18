import mongoose from 'mongoose';

const Transaction = new mongoose.Schema(
  {
    card: { type: mongoose.Schema.ObjectId, ref: 'Card' },
    amount: { type: Number, required: true, default: 0 },
    capturedAmount: { type: Number, default: 0 },
    reversedAmount: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    authorized: { type: Boolean },
    refunded: { type: Boolean },
  },
  {
    strict: true,
  }
);

export default mongoose.model('Transaction', Transaction);
