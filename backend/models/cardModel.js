import mongoose from 'mongoose';

const Card = new mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String},
  balance: {type: Number, default: 0},
  blockedBalance: {type: Number, default: 0},
  transactions: [{type: mongoose.Schema.ObjectId, ref: 'Transaction'}],
  locked: {type: Boolean},
}, {
  strict: true,
});

export default mongoose.model('Card', Card);
