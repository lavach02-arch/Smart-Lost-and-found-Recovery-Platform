const User = require('../models/User');
const Item = require('../models/Item');
const RecoveryRequest = require('../models/RecoveryRequest');
const Report = require('../models/Report');
const AdminActivity = require('../models/AdminActivity');
const { findMatchesForItem } = require('../services/matchingService');

// @desc    Get admin dashboard overall statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
const getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalLostItems = await Item.countDocuments({ status: 'lost' });
    const totalFoundItems = await Item.countDocuments({ status: 'found' });
    const pendingRecoveryRequests = await RecoveryRequest.countDocuments({ status: 'PENDING' });
    const completedRecoveries = await RecoveryRequest.countDocuments({ status: 'COMPLETED' });
    const pendingReports = await Report.countDocuments({ status: 'PENDING' });

    // Calculate match count across candidate items
    const sampleItems = await Item.find().limit(20).select('_id status');
    let totalPotentialMatches = 0;
    for (const item of sampleItems) {
      try {
        const matchRes = await findMatchesForItem(item._id);
        if (matchRes.matches) {
          totalPotentialMatches += matchRes.matches.length;
        }
      } catch (err) {
        // Skip individual item errors
      }
    }

    // Recent admin activity logs
    const recentActivity = await AdminActivity.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('admin', 'name email');

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalLostItems,
        totalFoundItems,
        totalMatches: totalPotentialMatches,
        pendingRecoveryRequests,
        completedRecoveries,
        pendingReports,
      },
      recentActivity,
    });
  } catch (error) {
    console.error('[getAdminDashboardStats Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching admin dashboard statistics',
    });
  }
};

// @desc    Get admin activity audit logs
// @route   GET /api/admin/activity
// @access  Private (Admin only)
const getAdminActivityLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const skip = (page - 1) * limit;

    const total = await AdminActivity.countDocuments();
    const logs = await AdminActivity.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('admin', 'name email avatar');

    return res.status(200).json({
      success: true,
      logs,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error('[getAdminActivityLogs Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching activity logs',
    });
  }
};

module.exports = {
  getAdminDashboardStats,
  getAdminActivityLogs,
};
