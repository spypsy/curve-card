import mongoose from 'mongoose';

const Transaction = new mongoose.Schema({
  amount: {type: Number, required: true},
  capturedAmount: {type: Number},
  reversedAmount: {type: Number},
  authorized: {type: Boolean},
  refunded: {type: Boolean},
  locked: {type: Boolean},
}, {
  string: true,
});

export default mongoose.model('Transaction', Transaction);
