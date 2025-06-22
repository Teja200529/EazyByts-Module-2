import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ✅ Add this
  symbol: { type: String, required: true },
  type: { type: String, enum: ['buy', 'sell'], required: true },
  shares: { type: Number, required: true },
  price: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  total: Number, // optional: total = shares * price, if you use it
});

export default mongoose.model('Trade', tradeSchema);
