const Item = require('../models/Item');
const AdminActivity = require('../models/AdminActivity');
const { ADMIN_ACTIONS } = require('../models/AdminActivity');

// @desc    Get all reported items with search, filters, pagination
// @route   GET /api/admin/items
// @access  Private (Admin only)
const getAdminItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status.toLowerCase();
    }

    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }, { location: searchRegex }];
    }

    const total = await Item.countDocuments(query);
    const items = await Item.find(query)
      .populate('owner', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error('[getAdminItems Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching admin item list',
    });
  }
};

// @desc    Get single item details by ID for admin
// @route   GET /api/admin/items/:id
// @access  Private (Admin only)
const getAdminItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('owner', 'name email avatar phone');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    return res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    console.error('[getAdminItemById Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching item details',
    });
  }
};

// @desc    Delete an item as admin
// @route   DELETE /api/admin/items/:id
// @access  Private (Admin only)
const deleteAdminItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    const itemTitle = item.title;
    await Item.findByIdAndDelete(req.params.id);

    // Log admin activity
    await AdminActivity.create({
      admin: req.user._id,
      action: ADMIN_ACTIONS.ITEM_DELETED,
      targetType: 'Item',
      targetId: req.params.id,
      description: `Admin ${req.user.name} deleted reported item "${itemTitle}"`,
    });

    return res.status(200).json({
      success: true,
      message: `Item "${itemTitle}" deleted successfully`,
    });
  } catch (error) {
    console.error('[deleteAdminItem Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting item',
    });
  }
};

module.exports = {
  getAdminItems,
  getAdminItemById,
  deleteAdminItem,
};
