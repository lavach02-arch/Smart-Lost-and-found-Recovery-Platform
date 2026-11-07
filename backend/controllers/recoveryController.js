const RecoveryRequest = require('../models/RecoveryRequest');
const { REQUEST_STATUS } = require('../models/RecoveryRequest');
const Item = require('../models/Item');
const Notification = require('../models/Notification');
const { NOTIFICATION_TYPES } = require('../models/Notification');

// @desc    Create a recovery claim request
// @route   POST /api/recovery-requests
// @access  Private
const createRecoveryRequest = async (req, res) => {
  try {
    const { itemId, message } = req.body;

    if (!itemId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both itemId and message',
      });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Security check: cannot request recovery on your own item
    if (item.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot submit a recovery request for your own reported item',
      });
    }

    // Check for active existing requests by this user for this item
    const existingActiveRequest = await RecoveryRequest.findOne({
      item: itemId,
      requester: req.user._id,
      status: { $in: [REQUEST_STATUS.PENDING, REQUEST_STATUS.ACCEPTED] },
    });

    if (existingActiveRequest) {
      return res.status(409).json({
        success: false,
        message: 'You already have an active recovery request for this item',
      });
    }

    const recoveryRequest = await RecoveryRequest.create({
      item: itemId,
      requester: req.user._id,
      owner: item.owner,
      message,
      status: REQUEST_STATUS.PENDING,
    });

    // Create notification for item owner
    await Notification.create({
      recipient: item.owner,
      type: NOTIFICATION_TYPES.RECOVERY_REQUEST,
      title: 'New Recovery Request',
      message: `${req.user.name} submitted a recovery claim for your reported item "${item.title}".`,
      relatedItem: item._id,
      relatedUser: req.user._id,
      relatedRequest: recoveryRequest._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Recovery request submitted successfully',
      recoveryRequest,
    });
  } catch (error) {
    console.error('[createRecoveryRequest Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating recovery request',
    });
  }
};

// @desc    Get recovery requests sent by logged in user
// @route   GET /api/recovery-requests/my-requests
// @access  Private
const getMyRequests = async (req, res) => {
  try {
    const requests = await RecoveryRequest.find({ requester: req.user._id })
      .sort({ createdAt: -1 })
      .populate('item', 'title category image status location date recoveryStatus')
      .populate('owner', 'name email avatar');

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error('[getMyRequests Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching your recovery requests',
    });
  }
};

// @desc    Get recovery requests received by logged in user (as item owner)
// @route   GET /api/recovery-requests/received
// @access  Private
const getReceivedRequests = async (req, res) => {
  try {
    const requests = await RecoveryRequest.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .populate('item', 'title category image status location date recoveryStatus')
      .populate('requester', 'name email avatar');

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error('[getReceivedRequests Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching received recovery requests',
    });
  }
};

// @desc    Get single recovery request by ID
// @route   GET /api/recovery-requests/:id
// @access  Private
const getRecoveryRequest = async (req, res) => {
  try {
    const request = await RecoveryRequest.findById(req.params.id)
      .populate('item', 'title category image status location date description additionalDetails recoveryStatus')
      .populate('requester', 'name email avatar')
      .populate('owner', 'name email avatar');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Recovery request not found',
      });
    }

    // Security check: requester or owner only
    const userId = req.user._id.toString();
    const requesterId = request.requester?._id?.toString() || request.requester?.toString();
    const ownerId = request.owner?._id?.toString() || request.owner?.toString();

    if (userId !== requesterId && userId !== ownerId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this recovery request',
      });
    }

    return res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    console.error('[getRecoveryRequest Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching recovery request details',
    });
  }
};

// @desc    Accept a recovery request
// @route   PUT /api/recovery-requests/:id/accept
// @access  Private (Owner only)
const acceptRequest = async (req, res) => {
  try {
    const request = await RecoveryRequest.findById(req.params.id).populate('item');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Recovery request not found',
      });
    }

    if (request.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the item owner can accept this recovery request',
      });
    }

    if (request.status !== REQUEST_STATUS.PENDING) {
      return res.status(400).json({
        success: false,
        message: `Cannot accept request with status ${request.status}`,
      });
    }

    request.status = REQUEST_STATUS.ACCEPTED;
    await request.save();

    if (request.item) {
      request.item.recoveryStatus = 'RECOVERY_IN_PROGRESS';
      await request.item.save();
    }

    // Notify requester
    await Notification.create({
      recipient: request.requester,
      type: NOTIFICATION_TYPES.REQUEST_ACCEPTED,
      title: 'Recovery Request Accepted!',
      message: `Your recovery request for item "${request.item?.title || 'Reported Item'}" has been ACCEPTED by the owner.`,
      relatedItem: request.item?._id,
      relatedUser: req.user._id,
      relatedRequest: request._id,
    });

    return res.status(200).json({
      success: true,
      message: 'Recovery request accepted successfully',
      request,
    });
  } catch (error) {
    console.error('[acceptRequest Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error accepting recovery request',
    });
  }
};

// @desc    Reject a recovery request
// @route   PUT /api/recovery-requests/:id/reject
// @access  Private (Owner only)
const rejectRequest = async (req, res) => {
  try {
    const request = await RecoveryRequest.findById(req.params.id).populate('item');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Recovery request not found',
      });
    }

    if (request.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the item owner can reject this recovery request',
      });
    }

    if (request.status !== REQUEST_STATUS.PENDING) {
      return res.status(400).json({
        success: false,
        message: `Cannot reject request with status ${request.status}`,
      });
    }

    request.status = REQUEST_STATUS.REJECTED;
    await request.save();

    // Notify requester
    await Notification.create({
      recipient: request.requester,
      type: NOTIFICATION_TYPES.REQUEST_REJECTED,
      title: 'Recovery Request Update',
      message: `Your recovery request for item "${request.item?.title || 'Reported Item'}" was reviewed and rejected.`,
      relatedItem: request.item?._id,
      relatedUser: req.user._id,
      relatedRequest: request._id,
    });

    return res.status(200).json({
      success: true,
      message: 'Recovery request rejected',
      request,
    });
  } catch (error) {
    console.error('[rejectRequest Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error rejecting recovery request',
    });
  }
};

// @desc    Cancel a recovery request
// @route   PUT /api/recovery-requests/:id/cancel
// @access  Private (Requester only)
const cancelRequest = async (req, res) => {
  try {
    const request = await RecoveryRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Recovery request not found',
      });
    }

    if (request.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the requester can cancel this request',
      });
    }

    if (request.status !== REQUEST_STATUS.PENDING) {
      return res.status(400).json({
        success: false,
        message: 'Only pending requests can be cancelled',
      });
    }

    request.status = REQUEST_STATUS.CANCELLED;
    await request.save();

    return res.status(200).json({
      success: true,
      message: 'Recovery request cancelled',
      request,
    });
  } catch (error) {
    console.error('[cancelRequest Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error cancelling recovery request',
    });
  }
};

// @desc    Complete a recovery request
// @route   PUT /api/recovery-requests/:id/complete
// @access  Private (Owner or Requester)
const completeRequest = async (req, res) => {
  try {
    const request = await RecoveryRequest.findById(req.params.id).populate('item');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Recovery request not found',
      });
    }

    const userId = req.user._id.toString();
    if (request.owner.toString() !== userId && request.requester.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this request',
      });
    }

    if (request.status !== REQUEST_STATUS.ACCEPTED) {
      return res.status(400).json({
        success: false,
        message: 'Only accepted requests can be marked as completed',
      });
    }

    request.status = REQUEST_STATUS.COMPLETED;
    await request.save();

    if (request.item) {
      request.item.recoveryStatus = 'RECOVERED';
      await request.item.save();
    }

    const otherPartyId = userId === request.owner.toString() ? request.requester : request.owner;

    await Notification.create({
      recipient: otherPartyId,
      type: NOTIFICATION_TYPES.SYSTEM,
      title: 'Item Recovery Completed',
      message: `The item recovery for "${request.item?.title || 'Reported Item'}" has been marked as COMPLETED.`,
      relatedItem: request.item?._id,
      relatedUser: req.user._id,
      relatedRequest: request._id,
    });

    return res.status(200).json({
      success: true,
      message: 'Recovery request marked as completed',
      request,
    });
  } catch (error) {
    console.error('[completeRequest Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error completing recovery request',
    });
  }
};

module.exports = {
  createRecoveryRequest,
  getMyRequests,
  getReceivedRequests,
  getRecoveryRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  completeRequest,
};
