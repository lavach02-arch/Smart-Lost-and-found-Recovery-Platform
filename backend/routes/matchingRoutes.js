const express = require('express');
const router = express.Router();
const { getMatches } = require('../controllers/matchingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:itemId', protect, getMatches);

module.exports = router;
