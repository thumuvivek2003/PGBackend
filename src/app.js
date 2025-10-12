const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const logger = require('./config/logger');

// Route imports
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
const feeRoutes = require('./routes/feeRoutes');
const billRoutes = require('./routes/billRoutes');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors());
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/auth', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: { write: message => logger.info(message.trim()) }
  }));
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

module.exports = app;
