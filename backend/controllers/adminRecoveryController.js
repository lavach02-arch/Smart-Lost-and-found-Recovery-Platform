const RecoveryRequest = require('../models/RecoveryRequest');

// @desc    Get all recovery requests with filtering and pagination
// @route   GET /api/admin/recovery-requests
// @access  Private (Admin only)
const getAdminRecoveryRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status.toUpperCase();
    }

    const total = await RecoveryRequest.countDocuments(query);
    const requests = await RecoveryRequest.find(query)
      .populate('item', 'title category image status location date')
      .populate('requester', 'name email avatar')
      .populate('owner', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      requests,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error('[getAdminRecoveryRequests Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching recovery requests list',
    });
  }
};

// @desc    Get single recovery request details by ID
// @route   GET /api/admin/recovery-requests/:id
// @access  Private (Admin only)
const getAdminRecoveryRequestById = async (req, res) => {
  try {
    const request = await RecoveryRequest.findById(req.params.id)
      .populate('item')
      .populate('requester', 'name email avatar phone')
      .populate('owner', 'name email avatar phone');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Recovery request not found',
      });
    }

    return res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    console.error('[getAdminRecoveryRequestById Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching recovery request details',
    });
  }
};

module.exports = {
  getAdminRecoveryRequests,
  getAdminRecoveryRequestById,
};
