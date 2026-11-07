const mongoose = require('mongoose');

const REPORT_REASONS = [
  'Incorrect Item',
  'Fake Listing',
  'Spam',
  'Inappropriate Content',
  'Other',
];

const REPORT_STATUS = {
  PENDING: 'PENDING',
  REVIEWED: 'REVIEWED',
  RESOLVED: 'RESOLVED',
  DISMISSED: 'DISMISSED',
};

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporter user is required'],
    },
    reportedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: [true, 'Reported item is required'],
    },
    reason: {
      type: String,
      required: [true, 'Please select a reason for reporting'],
      enum: REPORT_REASONS,
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(REPORT_STATUS),
      default: REPORT_STATUS.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ reportedItem: 1, reporter: 1 });

module.exports = mongoose.model('Report', reportSchema);
module.exports.REPORT_REASONS = REPORT_REASONS;
module.exports.REPORT_STATUS = REPORT_STATUS;
