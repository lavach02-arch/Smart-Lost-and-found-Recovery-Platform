const mongoose = require('mongoose');

const CATEGORIES = [
  'Electronics',
  'Mobile Phones',
  'Laptops',
  'Wallets',
  'Bags',
  'Documents',
  'ID Cards',
  'Keys',
  'Jewelry',
  'Clothing',
  'Books',
  'Accessories',
  'Other',
];

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an item title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a detailed description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: CATEGORIES,
    },
    status: {
      type: String,
      required: [true, 'Please specify status as lost or found'],
      enum: ['lost', 'found'],
      lowercase: true,
    },
    location: {
      type: String,
      required: [true, 'Please specify the location (e.g. Guntur Bus Stand, Main Library)'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Please specify the date when item was lost or found'],
    },
    time: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&q=80&w=800',
    },
    additionalDetails: {
      type: String,
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Item owner is required'],
    },
    recoveryStatus: {
      type: String,
      enum: ['AVAILABLE', 'RECOVERY_IN_PROGRESS', 'RECOVERED'],
      default: 'AVAILABLE',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high performance querying & matching
itemSchema.index({ status: 1, category: 1, createdAt: -1 });
itemSchema.index({ owner: 1, createdAt: -1 });
itemSchema.index({ location: 'text', title: 'text', description: 'text' });

module.exports = mongoose.model('Item', itemSchema);
module.exports.CATEGORIES = CATEGORIES;
