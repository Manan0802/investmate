import mongoose from 'mongoose';

// This sub-schema defines the structure for a single sale event.
const saleSchema = new mongoose.Schema({
  unitsSold: {
    type: Number,
    required: true,
  },
  sellPrice: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

// This is our main schema for a single 'buy' investment entry.
const investmentSchema = new mongoose.Schema(
  {
    // Link to the user who owns this investment
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // Category of the asset
    assetType: {
      type: String,
      required: true,
      enum: ['Stocks', 'Crypto', 'Real Estate', 'Other'],
    },
    // The specific name or ticker (e.g., 'RELIANCE.NS')
    assetName: {
      type: String,
      required: true,
      trim: true,
    },
    // The total number of units initially purchased
    quantity: {
      type: Number,
      required: true,
    },
    // The price per unit at the time of purchase
    buyPrice: {
      type: Number,
      required: true,
    },
    // The date of the purchase
    date: {
      type: Date,
      required: true,
    },
    // An array to store multiple sale events for this specific investment
    sales: [saleSchema],
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

const Investment = mongoose.model('Investment', investmentSchema);
export default Investment;