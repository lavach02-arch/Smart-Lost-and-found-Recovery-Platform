const express = require('express');
const router = express.Router();
const {
  createLostItem,
  createFoundItem,
  getItems,
  getMyReports,
  getItemById,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getItems);
router.get('/my-reports', protect, getMyReports);
router.post('/lost', protect, createLostItem);
router.post('/found', protect, createFoundItem);

router
  .route('/:id')
  .get(getItemById)
  .put(protect, updateItem)
  .delete(protect, deleteItem);

module.exports = router;
