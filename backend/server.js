const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');
const itemRoutes = require('./routes/itemRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const matchingRoutes = require('./routes/matchingRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const recoveryRoutes = require('./routes/recoveryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reportRoutes = require('./routes/reportRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// Apply global API Rate Limiter
app.use('/api', apiLimiter);

// Production & Development CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://smartfind-frontend.onrender.com',
  'https://smart-lost-and-found-recovery-platfofrm.onrender.com',
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || allowedOrigins.some(o => o && origin.startsWith(o))) {
      return callback(null, true);
    }
    try {
      const hostname = new URL(origin).hostname;
      if (hostname.endsWith('.onrender.com') || hostname.endsWith('.vercel.app')) {
        return callback(null, true);
      }
    } catch (e) {
      // Ignore URL parsing errors
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply Auth Limiter to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Health Check API Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SmartFind API is running',
    version: '1.0.0 (Phase 6)',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/recovery-requests', recoveryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);

// Root route summary
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to SmartFind API (Smart Lost & Found Recovery Platform)',
    healthCheck: '/api/health',
    itemsEndpoint: '/api/items',
    phase: 'Phase 6 - Admin Dashboard & Platform Management',
  });
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 SmartFind Express Server running on port ${PORT}`);
    console.log(`🌐 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
};

startServer();
// Updated seeder with 15 items
