const Report = require('../models/Report');
const { REPORT_STATUS } = require('../models/Report');
const Item = require('../models/Item');
const AdminActivity = require('../models/AdminActivity');
const { ADMIN_ACTIONS } = require('../models/AdminActivity');

// @desc    Submit a report for an item (Normal User)
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res) => {
  try {
    const { itemId, reason, description } = req.body;

    if (!itemId || !reason || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide itemId, reason, and description',
      });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    const report = await Report.create({
      reporter: req.user._id,
      reportedItem: itemId,
      reason,
      description,
      status: REPORT_STATUS.PENDING,
    });

    return res.status(201).json({
      success: true,
      message: 'Report submitted successfully. Administrators will review it.',
      report,
    });
  } catch (error) {
    console.error('[createReport Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error submitting report',
    });
  }
};

// @desc    Get all submitted reports (Admin only)
// @route   GET /api/admin/reports
// @access  Private (Admin only)
const getAdminReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status.toUpperCase();
    }

    const total = await Report.countDocuments(query);
    const reports = await Report.find(query)
      .populate('reporter', 'name email avatar')
      .populate('reportedItem', 'title category image status location owner')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      reports,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error('[getAdminReports Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching reports list',
    });
  }
};

// @desc    Get report details by ID (Admin only)
// @route   GET /api/admin/reports/:id
// @access  Private (Admin only)
const getAdminReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('reporter', 'name email avatar phone')
      .populate({
        path: 'reportedItem',
        populate: { path: 'owner', select: 'name email avatar phone' },
      });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error('[getAdminReportById Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching report details',
    });
  }
};

// @desc    Update report status (Admin only)
// @route   PUT /api/admin/reports/:id/status
// @access  Private (Admin only)
const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!Object.values(REPORT_STATUS).includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${Object.values(REPORT_STATUS).join(', ')}`,
      });
    }

    const report = await Report.findById(req.params.id).populate('reportedItem');
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    report.status = status;
    await report.save();

    let actionType = ADMIN_ACTIONS.REPORT_REVIEWED;
    if (status === REPORT_STATUS.RESOLVED) actionType = ADMIN_ACTIONS.REPORT_RESOLVED;
    if (status === REPORT_STATUS.DISMISSED) actionType = ADMIN_ACTIONS.REPORT_DISMISSED;

    await AdminActivity.create({
      admin: req.user._id,
      action: actionType,
      targetType: 'Report',
      targetId: report._id.toString(),
      description: `Admin ${req.user.name} set report status for item "${report.reportedItem?.title || 'Item'}" to ${status}`,
    });

    return res.status(200).json({
      success: true,
      message: `Report status updated to ${status}`,
      report,
    });
  } catch (error) {
    console.error('[updateReportStatus Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating report status',
    });
  }
};

module.exports = {
  createReport,
  getAdminReports,
  getAdminReportById,
  updateReportStatus,
};
