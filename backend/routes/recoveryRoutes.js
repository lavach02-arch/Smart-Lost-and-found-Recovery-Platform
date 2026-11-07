const express = require('express');
const router = express.Router();
const {
  createRecoveryRequest,
  getMyRequests,
  getReceivedRequests,
  getRecoveryRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  completeRequest,
} = require('../controllers/recoveryController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createRecoveryRequest);
router.get('/my-requests', getMyRequests);
router.get('/received', getReceivedRequests);
router.get('/:id', getRecoveryRequest);
router.put('/:id/accept', acceptRequest);
router.put('/:id/reject', rejectRequest);
router.put('/:id/cancel', cancelRequest);
router.put('/:id/complete', completeRequest);

module.exports = router;
