// Error handling middleware for Express backend
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  if (err.message && (err.message.includes('buffering timed out') || err.message.includes('Could not connect to any servers'))) {
    statusCode = 503;
    message = 'Database connection error. Please ensure your IP address is whitelisted in MongoDB Atlas Network Access (0.0.0.0/0).';
  }

  console.error(`❌ [Server Error] ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

// 404 handler for undefined API routes
const notFound = (req, res, next) => {
  const error = new Error(`API Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = {
  errorHandler,
  notFound,
};
