const mongoose = require('mongoose');

const REQUEST_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
};

const recoveryRequestSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: [true, 'Item is required for recovery request'],
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Requester is required'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Item owner is required'],
    },
    message: {
      type: String,
      required: [true, 'Please provide a message explaining why this is your item'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(REQUEST_STATUS),
      default: REQUEST_STATUS.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

// Index to support quick lookup and prevent duplicate active requests per item & requester
recoveryRequestSchema.index({ item: 1, requester: 1 });
recoveryRequestSchema.index({ owner: 1, status: 1, createdAt: -1 });
recoveryRequestSchema.index({ requester: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('RecoveryRequest', recoveryRequestSchema);
module.exports.REQUEST_STATUS = REQUEST_STATUS;
