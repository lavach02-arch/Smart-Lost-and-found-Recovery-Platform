/**
 * Middleware to restrict access to ADMIN users only.
 * Must be used AFTER authMiddleware.protect
 */
const adminProtect = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Admin access required. Access denied.',
  });
};

module.exports = { adminProtect };
