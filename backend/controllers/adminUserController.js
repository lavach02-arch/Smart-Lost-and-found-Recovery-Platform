const User = require('../models/User');
const AdminActivity = require('../models/AdminActivity');
const { ADMIN_ACTIONS } = require('../models/AdminActivity');

// @desc    Get all users with search, filtering, pagination
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAdminUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    if (req.query.role) {
      query.role = req.query.role;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      users,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error('[getAdminUsers Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching user list',
    });
  }
};

// @desc    Get single user details by ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin only)
const getAdminUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('[getAdminUserById Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching user details',
    });
  }
};

// @desc    Update user status (ACTIVE / SUSPENDED)
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['ACTIVE', 'SUSPENDED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be ACTIVE or SUSPENDED.',
      });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Safety: prevent admin from suspending themselves
    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot suspend your own admin account.',
      });
    }

    targetUser.status = status;
    await targetUser.save();

    // Log admin activity
    const actionType = status === 'SUSPENDED' ? ADMIN_ACTIONS.USER_SUSPENDED : ADMIN_ACTIONS.USER_ACTIVATED;
    await AdminActivity.create({
      admin: req.user._id,
      action: actionType,
      targetType: 'User',
      targetId: targetUser._id.toString(),
      description: `Admin ${req.user.name} changed status of user "${targetUser.name}" (${targetUser.email}) to ${status}`,
    });

    return res.status(200).json({
      success: true,
      message: `User status updated to ${status}`,
      user: {
        _id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        status: targetUser.status,
      },
    });
  } catch (error) {
    console.error('[updateUserStatus Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating user status',
    });
  }
};

// @desc    Update user role (USER / ADMIN)
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin only)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role value. Must be USER or ADMIN.',
      });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Safety check: ensure at least one active admin remains
    if (role === 'USER' && targetUser.role === 'ADMIN') {
      const adminCount = await User.countDocuments({ role: 'ADMIN', status: 'ACTIVE' });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot revoke ADMIN role. Platform must have at least one active administrator.',
        });
      }
    }

    const oldRole = targetUser.role;
    targetUser.role = role;
    await targetUser.save();

    // Log admin activity
    await AdminActivity.create({
      admin: req.user._id,
      action: ADMIN_ACTIONS.ROLE_CHANGED,
      targetType: 'User',
      targetId: targetUser._id.toString(),
      description: `Admin ${req.user.name} changed role of "${targetUser.name}" from ${oldRole} to ${role}`,
    });

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        _id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        status: targetUser.status,
      },
    });
  } catch (error) {
    console.error('[updateUserRole Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating user role',
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteAdminUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own active admin account.',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('[deleteAdminUser Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting user',
    });
  }
};

module.exports = {
  getAdminUsers,
  getAdminUserById,
  updateUserStatus,
  updateUserRole,
  deleteAdminUser,
};
