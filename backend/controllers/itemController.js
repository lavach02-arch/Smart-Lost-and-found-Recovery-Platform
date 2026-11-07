const Item = require('../models/Item');
const mongoose = require('mongoose');

// Sample fallback items for demonstration when database has no records
const sampleItems = [
  {
    _id: "demo-1",
    title: "Silver MacBook Pro 14-inch (M2)",
    description: "Space Gray 14-inch MacBook Pro in a dark gray felt sleeve. Left near table 14 in the Central Campus Library.",
    category: "Laptops",
    location: "Central Campus Library, 2nd Floor",
    date: "2026-09-17",
    time: "10:30 AM",
    status: "lost",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
    additionalDetails: "Has a GitHub sticker on top lid. $50 reward offered!",
    owner: { _id: "demo-owner-1", name: "Lakshmi", email: "lakshmi@gmail.com" },
    createdAt: "2026-09-17T11:00:00.000Z"
  },
  {
    _id: "demo-2",
    title: "Brown Leather Bi-fold Wallet",
    description: "Fossil brand brown leather wallet containing a student card and public transit pass. Found under cafeteria table 8.",
    category: "Wallets",
    location: "Student Union Cafeteria",
    date: "2026-09-18",
    time: "02:15 PM",
    status: "found",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800",
    additionalDetails: "Handed over to Security Desk Office #102.",
    owner: { _id: "demo-owner-2", name: "Campus Security", email: "security@smartfind.demo" },
    createdAt: "2026-09-18T15:00:00.000Z"
  },
  {
    _id: "demo-3",
    title: "Sony WH-1000XM4 Wireless Headphones",
    description: "Black Sony noise-canceling headphones in a round zippered protective case. Left on a outdoor quad bench.",
    category: "Electronics",
    location: "Science Complex Quad",
    date: "2026-09-16",
    time: "04:45 PM",
    status: "lost",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
    additionalDetails: "Includes charging cable inside headphone case.",
    owner: { _id: "demo-owner-1", name: "Lakshmi", email: "lakshmi@gmail.com" },
    createdAt: "2026-09-16T17:00:00.000Z"
  },
  {
    _id: "demo-4",
    title: "Black Samsung Galaxy S23 Phone",
    description: "Black Samsung Galaxy phone with a transparent blue protective case. Found near bus shelter platform.",
    category: "Mobile Phones",
    location: "Guntur Bus Stand",
    date: "2026-09-19",
    time: "09:00 AM",
    status: "found",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
    additionalDetails: "Lock screen wallpaper shows a mountain landscape.",
    owner: { _id: "demo-owner-3", name: "Station Security", email: "bus.security@smartfind.demo" },
    createdAt: "2026-09-19T09:30:00.000Z"
  },
  {
    _id: "demo-5",
    title: "Herschel Canvas Backpack",
    description: "Navy blue canvas backpack containing calculus textbooks, spiral notebooks, and a stainless steel water bottle.",
    category: "Bags",
    location: "Engineering Hall, Room 304",
    date: "2026-09-15",
    time: "11:20 AM",
    status: "lost",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800",
    additionalDetails: "Has a small metal keychain attached to front zipper.",
    owner: { _id: "demo-owner-1", name: "Lakshmi", email: "lakshmi@gmail.com" },
    createdAt: "2026-09-15T12:00:00.000Z"
  },
  {
    _id: "demo-6",
    title: "Apple Watch Series 8 (GPS)",
    description: "Midnight aluminum case with a black sport band. Found on bench inside locker room.",
    category: "Electronics",
    location: "Campus Gym Locker Room",
    date: "2026-09-20",
    time: "06:30 PM",
    status: "found",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800",
    additionalDetails: "Turned in to gym reception counter.",
    owner: { _id: "demo-owner-2", name: "Gym Desk", email: "gym@smartfind.demo" },
    createdAt: "2026-09-20T19:00:00.000Z"
  },
  {
    _id: "demo-7",
    title: "Honda Car Key Fob & Red Lanyard",
    description: "Remote key fob for Honda vehicle with two brass keys on a red woven lanyard.",
    category: "Keys",
    location: "North Parking Lot, Row D",
    date: "2026-09-19",
    time: "01:10 PM",
    status: "found",
    image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=800",
    additionalDetails: "Found near parking spot #42.",
    owner: { _id: "demo-owner-3", name: "Campus Security", email: "security@smartfind.demo" },
    createdAt: "2026-09-19T13:30:00.000Z"
  },
  {
    _id: "demo-8",
    title: "Ray-Ban Classic Aviator Sunglasses",
    description: "Gold frame Ray-Ban sunglasses with green lenses inside a dark brown protective leather pouch.",
    category: "Accessories",
    location: "Student Center Outdoor Patio",
    date: "2026-09-14",
    time: "03:00 PM",
    status: "lost",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800",
    additionalDetails: "Microfiber cleaning cloth inside case.",
    owner: { _id: "demo-owner-1", name: "Lakshmi", email: "lakshmi@gmail.com" },
    createdAt: "2026-09-14T15:30:00.000Z"
  },
  {
    _id: "demo-9",
    title: "Student ID Card & Metro Transit Pass",
    description: "University Student Identification card and monthly city metro pass in a clear plastic holder.",
    category: "ID Cards",
    location: "Main Campus Dining Hall",
    date: "2026-09-21",
    time: "08:30 AM",
    status: "lost",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800",
    additionalDetails: "Name on card matches Lakshmi.",
    owner: { _id: "demo-owner-1", name: "Lakshmi", email: "lakshmi@gmail.com" },
    createdAt: "2026-09-21T09:00:00.000Z"
  }
];

/**
 * @desc    Create a lost item report
 * @route   POST /api/items/lost
 * @access  Private
 */
const createLostItem = async (req, res, next) => {
  try {
    const { title, description, category, location, date, time, image, additionalDetails } = req.body;

    if (!title || !description || !category || !location || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (title, description, category, location, date)',
      });
    }

    const item = await Item.create({
      title,
      description,
      category,
      status: 'lost',
      location,
      date,
      time: time || '',
      image: image || undefined,
      additionalDetails: additionalDetails || '',
      owner: req.user._id,
    });

    const populatedItem = await Item.findById(item._id).populate('owner', 'name email phone profileImage');

    return res.status(201).json({
      success: true,
      message: 'Lost item report created successfully',
      item: populatedItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a found item report
 * @route   POST /api/items/found
 * @access  Private
 */
const createFoundItem = async (req, res, next) => {
  try {
    const { title, description, category, location, date, time, image, additionalDetails } = req.body;

    if (!title || !description || !category || !location || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (title, description, category, location, date)',
      });
    }

    const item = await Item.create({
      title,
      description,
      category,
      status: 'found',
      location,
      date,
      time: time || '',
      image: image || undefined,
      additionalDetails: additionalDetails || '',
      owner: req.user._id,
    });

    const populatedItem = await Item.findById(item._id).populate('owner', 'name email phone profileImage');

    return res.status(201).json({
      success: true,
      message: 'Found item report created successfully',
      item: populatedItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all items with search, filters, and pagination
 * @route   GET /api/items
 * @access  Public
 */
const getItems = async (req, res, next) => {
  try {
    const { status, category, location, search, page = 1, limit = 10 } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status.toLowerCase();
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
        { category: searchRegex },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    if (mongoose.connection.readyState === 1) {
      const totalItems = await Item.countDocuments(query);
      const items = await Item.find(query)
        .populate('owner', 'name email phone profileImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      if (totalItems > 0 || Object.keys(query).length > 0) {
        const totalPages = Math.ceil(totalItems / limitNum) || 1;
        return res.status(200).json({
          success: true,
          count: items.length,
          pagination: {
            page: pageNum,
            limit: limitNum,
            totalItems,
            totalPages,
          },
          data: items,
        });
      }
    }

    // Fallback demo items if database is empty
    let filteredDemos = [...sampleItems];
    if (status && status !== 'all') {
      filteredDemos = filteredDemos.filter((i) => i.status === status.toLowerCase());
    }
    if (category && category !== 'All') {
      filteredDemos = filteredDemos.filter((i) => i.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      filteredDemos = filteredDemos.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      success: true,
      count: filteredDemos.length,
      pagination: {
        page: 1,
        limit: limitNum,
        totalItems: filteredDemos.length,
        totalPages: 1,
      },
      data: filteredDemos,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get reports belonging to authenticated user
 * @route   GET /api/items/my-reports
 * @access  Private
 */
const getMyReports = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { owner: req.user._id };

    if (status && status !== 'all') {
      query.status = status.toLowerCase();
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const totalItems = await Item.countDocuments(query);
    const items = await Item.find(query)
      .populate('owner', 'name email phone profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalItems / limitNum) || 1;

    return res.status(200).json({
      success: true,
      count: items.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalItems,
        totalPages,
      },
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single item by ID
 * @route   GET /api/items/:id
 * @access  Public
 */
const getItemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.Types.ObjectId.isValid(id)) {
      const item = await Item.findById(id).populate('owner', 'name email phone profileImage');
      if (item) {
        return res.status(200).json({
          success: true,
          data: item,
        });
      }
    }

    const demoItem = sampleItems.find((i) => i._id === id);
    if (demoItem) {
      return res.status(200).json({
        success: true,
        data: demoItem,
      });
    }

    return res.status(404).json({
      success: false,
      message: 'Item report not found',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update item report (Owner only)
 * @route   PUT /api/items/:id
 * @access  Private
 */
const updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid item ID or report not found',
      });
    }

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item report not found',
      });
    }

    // Verify ownership
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this item',
      });
    }

    const fieldsToUpdate = ['title', 'description', 'category', 'location', 'date', 'time', 'image', 'additionalDetails'];
    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });

    const updatedItem = await item.save();
    const populatedItem = await Item.findById(updatedItem._id).populate('owner', 'name email phone profileImage');

    return res.status(200).json({
      success: true,
      message: 'Item report updated successfully',
      item: populatedItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete item report (Owner only)
 * @route   DELETE /api/items/:id
 * @access  Private
 */
const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid item ID or report not found',
      });
    }

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item report not found',
      });
    }

    // Verify ownership
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this item',
      });
    }

    await item.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Item report deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLostItem,
  createFoundItem,
  getItems,
  getMyReports,
  getItemById,
  updateItem,
  deleteItem,
};
