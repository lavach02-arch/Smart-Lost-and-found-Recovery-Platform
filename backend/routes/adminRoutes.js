const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminProtect } = require('../middleware/adminMiddleware');

const {
  getAdminDashboardStats,
  getAdminActivityLogs,
} = require('../controllers/adminController');

const {
  getAdminUsers,
  getAdminUserById,
  updateUserStatus,
  updateUserRole,
  deleteAdminUser,
} = require('../controllers/adminUserController');

const {
  getAdminItems,
  getAdminItemById,
  deleteAdminItem,
} = require('../controllers/adminItemController');

const {
  getAdminRecoveryRequests,
  getAdminRecoveryRequestById,
} = require('../controllers/adminRecoveryController');

const {
  getAdminReports,
  getAdminReportById,
  updateReportStatus,
} = require('../controllers/reportController');

// All admin endpoints require authentication and ADMIN role
router.use(protect);
router.use(adminProtect);

// Dashboard & Activity
router.get('/dashboard', getAdminDashboardStats);
router.get('/activity', getAdminActivityLogs);

// Users Management
router.get('/users', getAdminUsers);
router.get('/users/:id', getAdminUserById);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteAdminUser);

// Items Management
router.get('/items', getAdminItems);
router.get('/items/:id', getAdminItemById);
router.delete('/items/:id', deleteAdminItem);

// Recovery Requests Monitoring
router.get('/recovery-requests', getAdminRecoveryRequests);
router.get('/recovery-requests/:id', getAdminRecoveryRequestById);

// Reports / Abuse Management
router.get('/reports', getAdminReports);
router.get('/reports/:id', getAdminReportById);
router.put('/reports/:id/status', updateReportStatus);

module.exports = router;
