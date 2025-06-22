import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  shares: {
    type: Number,
    required: true,
    min: [1, 'Shares must be at least 1'],
  },
  avgPrice: {
    type: Number,
    required: true,
    min: [0, 'Average price must be non-negative'],
  },
  totalValue: {
    type: Number,
    required: true, // equals shares * avgPrice
  }
});

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 100000,
      min: [0, 'Balance cannot be negative'],
    },
    stocks: [stockSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Portfolio', portfolioSchema);
